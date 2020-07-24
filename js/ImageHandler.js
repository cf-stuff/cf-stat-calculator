import JsonHandler from "./JsonHandler.js";

export default class ImageHandler {
  static images = new Map();

  static loadImage(url) {
    return new Promise((resolve, reject) => {
      const image = new Image();
      image.src = url;
      this.images.set(url, image);
      image.addEventListener("load", () => resolve(image));
      image.onerror = reject;
    });
  }

  static getImage(name, id) {
    return this.getImageFromUrl(JsonHandler.getJson(name).url.replace("[id]", id));
  }

  static async getImageFromUrl(url) {
    if (!this.images.has(url)) {
      await this.loadImage(url);
    }
    return this.images.get(url);
  }
}
