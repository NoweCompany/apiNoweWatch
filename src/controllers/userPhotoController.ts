import { Request, Response } from 'express';
import busboy from 'busboy';

import { UserPhotoServiceAbstract } from '../services/UserPhotoService'


class UserPhotoController {
  constructor(private userPhotoService: UserPhotoServiceAbstract) {}
  async store(req: Request, res: Response) {
    try {
      const bb = busboy({
        headers: req.headers,
        limits: {
          files: 1,
          fileSize: 1024 * 350
        }
      });

      bb.on('file', async (name, file, info) => {
        const result = await this.userPhotoService.processFile(name, file, info);
        if (result) {
          res.status(result.status).json({ message: result.message });
          res.end();
        }
      });

      bb.on('close', () => {
        console.log('Done parsing form!');
        res.status(200).json(null);
        res.end();
      });

      req.pipe(bb);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: 'Internal server error.' });
    }
  }
}

export default UserPhotoController;
