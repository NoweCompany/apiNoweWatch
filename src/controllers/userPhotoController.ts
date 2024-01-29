import { Request, Response } from 'express';
import busboy from 'busboy';

import { UserPhotoServiceAbstract } from '../services/UserPhotoService'

class UserPhotoController {
  constructor(private userPhotoService: UserPhotoServiceAbstract) {}
  async store(req: Request, res: Response) {
    try {
      const { userId } = req

      const bb = busboy({
        headers: req.headers,
        limits: {
          files: 1,
          fileSize: 1024 * 350
        }
      });

      bb.on('file', async (name, file, info) => {
        if(!file) res.status(400).json('Invalid file.')
        await this.userPhotoService.processFile(name, file, info, res, Number(userId));
      });

      bb.on('error', (err: string) => {
        console.log(err)
        throw new Error(err)
      })

      bb.on('close', () => {
        res.end()
        console.log('Done parsing form!');
      });

      req.pipe(bb);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: 'Internal server error.' });
    }
  }
}

export default UserPhotoController;
