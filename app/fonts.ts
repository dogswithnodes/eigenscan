import localFont from 'next/font/local';

const montserrat = localFont({
  src: [
    { path: './_lib/fonts/montserrat-regular.woff2', weight: '400' },
    { path: './_lib/fonts/montserrat-medium.woff2', weight: '500' },
    { path: './_lib/fonts/montserrat-semi-bold.woff2', weight: '600' },
    { path: './_lib/fonts/montserrat-bold.woff2', weight: '700' },
  ],
  style: 'normal',
  display: 'swap',
});
const robotoMono = localFont({
  src: './_lib/fonts/roboto-mono-medium.woff2',
  display: 'swap',
});
const thunder = localFont({ src: './_lib/fonts/thunder-bold.woff2', display: 'swap' });

export const fontFamily = {
  montserrat: montserrat.style.fontFamily,
  robotoMono: robotoMono.style.fontFamily,
  thunder: thunder.style.fontFamily,
};
