import { loadImage } from '../../app/helpers/loadImage';

const compiler = new window['MINDAR'].IMAGE.Compiler();

export async function compile(fileList) {
  const images: any[] = [];
  let image;
  for (let i = 0; i < fileList.length; i++) {
    image = await loadImage(fileList[i]);
    images.push(image);
  }

  await compiler.compileImageTargets(images, (/*progress: number*/) => {
    //
  });

  const exportedBuffer = await compiler.exportData();
  const blob = new Blob([exportedBuffer]);

  return { blob };
}
