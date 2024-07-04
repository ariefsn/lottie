import { DIRS, JsonError } from "@helper";
import { TMap } from "@types";
import { FastifyPluginAsync } from "fastify";
import fs from 'fs';
import path from 'path';

const files: FastifyPluginAsync = async (fastify, opts): Promise<void> => {
  fastify.get('/:id', async function (request, reply) {
    const { id } = request.params as { id: string }
    const query = request.query as TMap
    const filepath = path.join(DIRS.UPLOADS, id)
    const isDownload = [1, true, 'true'].includes(query.download)

    if (!fs.existsSync(filepath)) {
      reply.status(404).send(JsonError('file not found'))
    }

    if (isDownload) {
      reply.header('Content-disposition', 'attachment; filename=' + id);
    }

    return reply.sendFile(id)
  })
}

export default files;
