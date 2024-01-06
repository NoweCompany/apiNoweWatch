import { createWriteStream, unlink, unlinkSync } from 'fs';
import { resolve } from 'path';
import { randomUUID } from 'crypto';

import MessageProtocol from '../interfaces/MessageInterface';

import busboy from 'busboy';

abstract class UserPhotoServiceAbstract{
  constructor(){}
  abstract processFile(name: string, file: NodeJS.ReadableStream, info: busboy.FileInfo): Promise<MessageProtocol | null>
}

class UserPhotoService extends UserPhotoServiceAbstract{
  constructor(){
    super()
  }

  async processFile(name: string, file: NodeJS.ReadableStream, info: busboy.FileInfo): Promise<MessageProtocol | null>{
    try {
      const { filename, encoding, mimeType } = info;
      const imageMimeTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/bmp'];

      if (!imageMimeTypes.includes(mimeType)) {
        return { status: 400, message: 'The file should be an image' };
      }

      const extName = mimeType.split('/')[1]
      const fileDiretory = resolve(__dirname, '..', '..', 'uploads', 'usersPhotos', `${randomUUID()}_${Date.now()}.${extName}`)
      const writableSteam = createWriteStream(fileDiretory)

      file.on('data', (data) => {
        //console.log(`File [${name}] got ${data.length} bytes`);
        console.log('data');
        if(data){
          writableSteam.write(data)
        }
      })

      file.on('close', () => {
        console.log(`File [${name}] done`);
      });

      file.on('limit', () => {
        unlinkSync(fileDiretory)
        console.log('File size exceeds the limit.');
        return { status: 400, message: 'Size exceeded Maximum size is 350MB' };
      })

      return null;
    } catch (error) {
      throw new Error('A error ocorred whille processing photo user!')
    }
  }
}

export {UserPhotoService, UserPhotoServiceAbstract}
