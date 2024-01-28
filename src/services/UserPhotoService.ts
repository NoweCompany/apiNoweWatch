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
  abstract processFile(name: string, file: NodeJS.ReadableStream, info: busboy.FileInfo, res: Response): Promise<Response | void>
}

class UserPhotoService extends UserPhotoServiceAbstract{
  constructor(prisma: PrismaClient){
    super(prisma)
  }

  async processFile(name: string, file: NodeJS.ReadableStream, info: busboy.FileInfo, res: Response): Promise<Response | void>{
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

      file.on('close', async () => {
        file.resume()
        writableSteam.end()

        try {
          // await this.prisma.photo.create({
          //   data: {
          //     orinal_name: originName,
          //     file_name: fileName,
          //     file_diretory: fileDiretory,
          //     user_id: 1
          //   }
          // })
          //console.log(await this.prisma.photo.findMany({}));

        } catch (error) {
          console.log(error);
          unlinkSync(fileDiretory)
          return res.status(400).json('An error ocurent while create users photo.')
        }

        console.log(`File [${name}] done`);
      });

      file.on('limit', async () => {
        file.resume()
        writableSteam.end()
        console.log('Size exceeded');

        unlinkSync(fileDiretory)

        //res.writeHead(400)
        res.status(400).json('Size exceeded, maximum size is 350MB')

        //console.log(res)
      })
    } catch (error) {
      console.log(error);
      throw new Error('A error ocorred whille processing photo user!')
    }
  }
}

export {UserPhotoService, UserPhotoServiceAbstract}
