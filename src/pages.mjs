// Content for every converter page. One entry = one URL.
// `slug: ''` is the home page (main keyword: "jpg to webp").

export const pages = [
  {
    slug: '',
    from: 'JPG',
    to: 'webp',
    title: 'JPG to WebP Converter — Free, Online, No Upload',
    description:
      'Convert JPG to WebP online for free. Batch convert up to 10 images, adjust quality, see exact size savings. Files never leave your browser.',
    h1: 'JPG to WebP Converter',
    lead: 'Drop your JPG images and get smaller WebP files in seconds. Conversion happens right in your browser — nothing is uploaded.',
    why: [
      'WebP is an image format made by Google for the web. According to Google, WebP lossy images are 25–34% smaller than JPEG images of the same visual quality.',
      'Smaller images mean faster pages, better Core Web Vitals scores and less bandwidth — which is why tools like PageSpeed Insights recommend serving images in next-gen formats such as WebP.',
      'Every modern browser — Chrome, Edge, Firefox, Safari and Opera — supports WebP, so it is safe to use on any website, online store or blog.'
    ],
    faq: [
      ['Is this JPG to WebP converter free?', 'Yes. The online converter is completely free, with no sign-up and no watermarks. You can convert up to 10 images at a time.'],
      ['Are my images uploaded to a server?', 'No. Your images are converted locally in your browser using the built-in canvas encoder. They never leave your computer, so the tool also works with private or confidential images.'],
      ['Will I lose quality when converting JPG to WebP?', 'At the default quality of 85% the difference is practically invisible, while the file usually gets noticeably smaller. You can raise the quality slider up to 100% if you need maximum fidelity.'],
      ['How do I convert many JPG files to WebP at once?', 'Drop several files into the converter and click “Download all (ZIP)”. For larger batches, or to convert images directly from websites with a right-click, install the free JPG to WebP Chrome extension.'],
      ['What quality setting should I use?', 'For photos on websites 75–85% is a good balance between size and quality. Use 90–100% for images where every detail matters, such as product close-ups.']
    ]
  },
  {
    slug: 'png-to-webp',
    from: 'PNG',
    to: 'webp',
    title: 'PNG to WebP Converter — Free Online, Keeps Transparency',
    description:
      'Convert PNG to WebP online for free. Keeps transparency, batch converts up to 10 images, shows size savings. No upload — runs in your browser.',
    h1: 'PNG to WebP Converter',
    lead: 'Turn heavy PNG files into compact WebP images with transparency preserved. Everything runs locally in your browser.',
    why: [
      'PNG files are great for graphics, screenshots and images with transparent backgrounds — but they are often very large. WebP supports transparency too, at a fraction of the size.',
      'According to Google, WebP lossless images are 26% smaller than PNGs, and lossy WebP with transparency is often several times smaller than the original PNG.',
      'Converting PNG logos, icons, UI screenshots and product cut-outs to WebP is one of the easiest ways to speed up a website.'
    ],
    faq: [
      ['Does PNG to WebP keep the transparent background?', 'Yes. WebP supports an alpha channel, so transparent areas of your PNG stay transparent after conversion.'],
      ['Why is my WebP sometimes bigger than the PNG?', 'Very small or very simple PNGs (a few colors, tiny icons) are already compact. Try lowering the quality slider — or keep the PNG for those files.'],
      ['Is the PNG to WebP converter free?', 'Yes, it is free with no sign-up and no watermarks. Up to 10 images can be converted at a time.'],
      ['Are my PNG files uploaded anywhere?', 'No. Conversion happens entirely in your browser; your files never leave your device.']
    ]
  },
  {
    slug: 'webp-to-jpg',
    from: 'WebP',
    to: 'jpg',
    title: 'WebP to JPG Converter — Free Online, No Upload',
    description:
      'Convert WebP to JPG online for free. Open WebP images anywhere — batch convert up to 10 files, adjust quality. Private: runs in your browser.',
    h1: 'WebP to JPG Converter',
    lead: 'Saved an image as .webp and it won’t open in your app? Convert WebP to JPG in one click — right in your browser.',
    why: [
      'Many websites now serve images as WebP. When you save such an image, some older programs, photo editors, upload forms or messengers may not accept it.',
      'JPG is the most widely supported image format in the world: it opens in every editor, operating system, printer and online service.',
      'Transparent areas of a WebP image are filled with white when converting to JPG, because JPG does not support transparency.'
    ],
    faq: [
      ['How do I convert WebP to JPG?', 'Drop the WebP file into the converter above, choose a quality and click Download. Your JPG is ready instantly.'],
      ['What happens to transparency?', 'JPG cannot store transparency, so transparent pixels are filled with white. If you need to keep transparency, convert WebP to PNG instead.'],
      ['Can I save images from websites directly as JPG?', 'Yes — with the free JPG to WebP Chrome extension you can right-click any image on a web page and choose “Convert image to → JPG”.'],
      ['Is it safe?', 'Yes. Files are processed locally in your browser and are never uploaded to any server.']
    ]
  },
  {
    slug: 'webp-to-png',
    from: 'WebP',
    to: 'png',
    title: 'WebP to PNG Converter — Free Online, Keeps Transparency',
    description:
      'Convert WebP to PNG online for free with transparency preserved. Batch convert up to 10 images. No upload — conversion runs in your browser.',
    h1: 'WebP to PNG Converter',
    lead: 'Convert WebP images to lossless PNG and keep transparent backgrounds. Fast, free and private.',
    why: [
      'PNG is a lossless format supported by virtually every image editor, design tool and operating system.',
      'Converting WebP to PNG is the best choice when you want to keep transparency or edit the image further without adding more compression artifacts.',
      'Note that PNG files are usually larger than WebP — that is the price of lossless quality and maximum compatibility.'
    ],
    faq: [
      ['Does WebP to PNG keep transparency?', 'Yes. PNG supports transparency, so the alpha channel of your WebP image is preserved.'],
      ['Why is the PNG file bigger than the WebP?', 'PNG is lossless and less efficient than WebP, so the same picture usually takes more space. That is normal.'],
      ['Is there a quality setting for PNG?', 'No. PNG is always lossless, so the quality slider is hidden when PNG is selected.'],
      ['Are my files uploaded?', 'No. All conversion happens on your device, inside your browser.']
    ]
  },
  {
    slug: 'png-to-jpg',
    from: 'PNG',
    to: 'jpg',
    title: 'PNG to JPG Converter — Free Online, No Upload',
    description:
      'Convert PNG to JPG online for free. Make large PNG screenshots and photos smaller. Batch convert up to 10 images — privately in your browser.',
    h1: 'PNG to JPG Converter',
    lead: 'Shrink large PNG photos and screenshots by converting them to JPG. Transparent areas become white.',
    why: [
      'PNG is ideal for graphics, but photos and screenshots saved as PNG can be several megabytes. The same image as JPG is often many times smaller.',
      'JPG is accepted everywhere — email attachments, upload forms, marketplaces and social networks.',
      'For the smallest files on websites, consider converting PNG to WebP instead — it keeps transparency and is usually even smaller than JPG.'
    ],
    faq: [
      ['What happens to the transparent background?', 'JPG does not support transparency, so transparent pixels are filled with white.'],
      ['Which quality should I choose?', '85% is a good default for photos. Screenshots with text look cleaner at 90–95%.'],
      ['Is the PNG to JPG converter free?', 'Yes — free, without registration or watermarks.'],
      ['Are my images uploaded?', 'No, conversion happens locally in your browser.']
    ]
  },
  {
    slug: 'jpg-to-png',
    from: 'JPG',
    to: 'png',
    title: 'JPG to PNG Converter — Free Online, No Upload',
    description:
      'Convert JPG to PNG online for free. Lossless output for editing and design. Batch convert up to 10 images — privately in your browser.',
    h1: 'JPG to PNG Converter',
    lead: 'Convert JPG images to lossless PNG for editing, design work or apps that require PNG. Nothing is uploaded.',
    why: [
      'PNG is lossless: once your image is in PNG, further editing and re-saving will not add new compression artifacts.',
      'Some design tools, icon generators and upload forms accept only PNG files.',
      'Converting JPG to PNG does not restore detail lost by JPG compression, and the PNG file will be larger. For websites, WebP is usually the better choice.'
    ],
    faq: [
      ['Will JPG to PNG improve image quality?', 'No. It keeps the current quality without adding further loss, but it cannot restore details already removed by JPG compression.'],
      ['Why is the PNG larger than my JPG?', 'PNG is lossless and is not designed for photos, so the file size grows. That is expected.'],
      ['Is it free?', 'Yes, free with no sign-up. Up to 10 files at a time.'],
      ['Are my images uploaded?', 'No, everything happens in your browser.']
    ]
  }
];
