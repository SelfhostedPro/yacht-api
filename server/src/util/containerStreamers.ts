import Docker from 'dockerode';
import { fromEvent, Observable, merge } from 'rxjs';
import { map } from 'rxjs/operators';
import { PassThrough as StreamPassThrough, Transform } from 'stream';
import { formatStats, FixedContainerStats } from './streamConverter';
export type ServerDict = {
  [key: string]: Docker;
};

export class DockerStatsStreamer {
  private servers: ServerDict;

  constructor(servers: ServerDict) {
    this.servers = servers;
  }
  private async attachStatsStream(
    docker: Docker,
    containerId: string,
  ): Promise<StreamPassThrough> {
    try {
      const statStream = new StreamPassThrough();
      const container = docker.getContainer(containerId);
      let cachedStats: FixedContainerStats | null = null;
      let partialChunk = '';

      const transformStatStream = new Transform({
        objectMode: true,
        transform(chunk, enc, callback) {
          try {
            const chunkString = partialChunk + chunk.toString();
            const jsonChunks = chunkString.split('\n');
            partialChunk = jsonChunks.pop(); // Store any incomplete chunk for the next iteration

            jsonChunks.forEach((jsonChunk) => {
              const containerStats: FixedContainerStats = JSON.parse(jsonChunk);
              if (
                !cachedStats ||
                containerStats.name !== cachedStats.name ||
                containerStats.cpu_stats.cpu_usage.total_usage !==
                  cachedStats.cpu_stats.cpu_usage.total_usage ||
                containerStats.memory_stats.usage !==
                  cachedStats.memory_stats.usage
              ) {
                cachedStats = containerStats;
                this.push(formatStats(containerStats));
              }
            });
          } catch (err) {
            console.error(
              'Error parsing JSON chunk in transformStatStream:',
              err,
            );
          }
          callback();
        },
      });
      const stream = await container.stats({ stream: true });
      stream.pipe(transformStatStream).pipe(statStream);
      return statStream;
    } catch (err) {
      console.error(
        `Error attaching stats stream for container \${containerId}:`,
        err,
      );
    }
  }

  private async processServer(server: Docker): Promise<StreamPassThrough[]> {
    try {
      const containerList = await server.listContainers();
      const containerPromises = containerList.map((app) =>
        this.attachStatsStream(server, app.Id),
      );
      const statStreams = await Promise.all(containerPromises);
      return statStreams;
    } catch (err) {
      console.error('Error processing server:', err);
      return [];
    }
  }

  public async streamBaseContainerStats(): Promise<Observable<MessageEvent>> {
    const servers: ServerDict = this.servers;
    const serverPromises = Object.values(servers).map((server) =>
      this.processServer(server),
    );
    const statStreams = await Promise.all(serverPromises);

    const observables = statStreams.map((statStream) =>
      fromEvent(statStream, 'data').pipe(
        map(
          (x: Buffer) =>
            ({
              data: `${x.toString()}`,
            } as MessageEvent),
        ),
      ),
    );

    const mergedObservable = merge(...observables);
    return mergedObservable;
  }
}
