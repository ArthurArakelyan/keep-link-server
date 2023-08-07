import express from 'express';
import fetch from 'node-fetch';
import * as cheerio from 'cheerio';

const router = express.Router();

const urlRegexp = /((([A-Za-z]{3,9}:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+(:[0-9]+)?|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)/;

router.get('/get-og', async (req, res) => {
  try {
    const { url } = req.query;

    if (!url) {
      return res.status(400).json({
        success: false,
        statusCode: 400,
        message: 'URL is not provided',
      });
    }

    if (!urlRegexp.test(url)) {
      return res.status(400).json({
        success: false,
        statusCode: 400,
        message: 'Provided URL is not valid',
      });
    }

    const response = await fetch(url);
    const html = await response.text();

    const $ = cheerio.load(html);

    const ogImage = $('meta[property="og:image"]').attr('content') || $('meta[property="og:image:url"]').attr('content') || $('meta[name="og:image"]').attr('content') || $('meta[name="og:image:url"]').attr('content');

    if (!ogImage) {
      return res.status(404).json({
        success: false,
        statusCode: 404,
        message: 'OG image not found',
      });
    }

    res.status(200).json({
      success: true,
      statusCode: 200,
      message: 'OG image received successfully',
      data: {
        ogImage,
      },
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      statusCode: 500,
      message: 'Something went wrong',
    });
  }
});

export default router;
