import { EscPosEncoder } from './esc-pos-encoder'
import { Writer, Fonts } from 'bdf-fonts'
import { Printer } from './NFCe-printer'

const canvas = document.getElementById('canvas') as HTMLCanvasElement
var ctx = canvas.getContext('2d')

const txt = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla vehicula nunc eu lacus tincidunt tincidunt.'
const fonte = Fonts.Boxxy[1]
const writer = new Writer(ctx, fonte.data, fonte.size)
// writer.writeText(txt, 0, 48, canvas.width, 'left')
const printer = new Printer(writer, canvas.width)
resizeCanvas(printer.alturaFinal)
// A inserção do logotipo pode ocorrer após o resize, onde o y inicial teria o offset do logotipo, interessante pôr também a opção de impressão do logotipo da NFC-e como disposto na seção 3.1.1
// DownloadCanvasAsImage()

function resizeCanvas(newHeight: number) {
  newHeight += 1
  if (newHeight % 8) newHeight = Math.ceil(newHeight / 8) * 8
  const data = ctx.getImageData(0, 0, canvas.width, newHeight)
  canvas.height = newHeight
  ctx.putImageData(data, 0, 0)
}

function DownloadCanvasAsImage(){
  let downloadLink = document.createElement('a');
  downloadLink.setAttribute('download', 'CanvasAsImage.png');
  canvas.toBlob(function(blob) {
    let url = URL.createObjectURL(blob);
    downloadLink.setAttribute('href', url);
    downloadLink.click();
  });
}

async function escolher() {
  const encoder = new EscPosEncoder('raster')
  let data = encoder.image(canvas).newline().encode()
  alert('Data criado')
  const nav = navigator as any
  const port = await nav.serial.requestPort()
  await port.open({ baudRate: 1200 })
  const writer = port.writable.getWriter()
  await writer.write(data)
  writer.releaseLock()
  port.close()
}

document.getElementById('escolher').onclick = () => escolher()
