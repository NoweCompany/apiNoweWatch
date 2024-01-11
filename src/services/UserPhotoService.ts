import { createWriteStream, unlinkSync } from 'fs';
import { resolve } from 'path';
import { randomUUID } from 'crypto';
import { Response } from 'express';

import { PrismaClient } from '@prisma/client';

import busboy from 'busboy';

abstract class UserPhotoServiceAbstract{
  protected prisma: PrismaClient
  constructor(prisma: PrismaClient){
    this.prisma = prisma
  }
  abstract processFile(name: string, file: NodeJS.ReadableStream, info: busboy.FileInfo, res: Response): Response | void
}

class UserPhotoService extends UserPhotoServiceAbstract{
  constructor(prisma: PrismaClient){
    super(prisma)
  }

  processFile(name: string, file: NodeJS.ReadableStream, info: busboy.FileInfo, res: Response): Response | void{
    try {
      const { filename: originName, encoding, mimeType } = info;
      const imageMimeTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/bmp'];

      if (!imageMimeTypes.includes(mimeType)) {
        res.status(400).json('The file should be an image')
        res.end()
        return
      }

      const extName = mimeType.split('/')[1]
      const fileName = `${randomUUID()}_${Date.now()}.${extName}`
      const fileDiretory = resolve(__dirname, '..', 'uploads', 'usersPhotos', `${fileName}`)
      const writableSteam = createWriteStream(fileDiretory)

      file.on('data', (data) => {
        console.log(`File [${name}] got ${data.length} bytes`);
        if(!file.isPaused()){
          writableSteam.write(data)
        }
      })

      file.on('close', () => {
        file.resume()
        writableSteam.end()

        try {
          this.prisma.photo.create({
            data: {
              orinal_name: originName,
              file_name: fileName,
              file_diretory: fileDiretory,
              user_id: 0
            }
          })
        } catch (error) {

        }

        console.log(`File [${name}] done`);

        return res.status(200).end();
      });

      file.on('limit', () => {
        file.resume()
        writableSteam.end()
        console.log('Size exceeded');

        unlinkSync(fileDiretory)

        res.status(400).json('Size exceeded, maximum size is 350MB');
      })
    } catch (error) {
      console.log(error);
      throw new Error('A error ocorred whille processing photo user!')
    }
  }
}

export {UserPhotoService, UserPhotoServiceAbstract}
