import {Timer} from "./timer";

export class Loader {

  private static showTimeout: number = 0;
  private static hideTimeout: number = 0;

  private static loaderElementRef: HTMLElement = null;
  private static loaderElementTemplate = `<div class="preloader-wrapper small">
    <div class="spinner-layer spinner-blue-only">
      <div class="circle-clipper left">
        <div class="circle"></div>
      </div><div class="gap-patch">
        <div class="circle"></div>
      </div><div class="circle-clipper right">
        <div class="circle"></div>
      </div>
    </div>
</div>`;

  public static show() {

    Timer.destroy(this.hideTimeout);

    if (!this.showTimeout) {

      this.showTimeout = Timer.timeout(300, () => {

        this.loaderElementRef = this.getLoaderElementRef();
        this.loaderElementRef.classList.add('active');

        Timer.destroy(this.showTimeout);
        this.showTimeout = 0;
      });
    }
  }

  public static hide() {

    Timer.destroy(this.showTimeout);
    this.showTimeout = 0;

    if (this.loaderElementRef) {

      this.loaderElementRef.classList.remove('active');

      if (!this.hideTimeout) {

        this.hideTimeout = Timer.timeout(300, () => {

          this.loaderElementRef.remove();
          this.loaderElementRef = null;

          Timer.destroy(this.hideTimeout);
          this.hideTimeout = 0;
        });
      }
    }
  }

  private static getLoaderElementRef() {

    if (!document.querySelector('app-loader')) {

      this.loaderElementRef = document.createElement('app-loader');
      this.loaderElementRef.innerHTML = this.loaderElementTemplate;
      document.querySelector('body').appendChild(this.loaderElementRef);
    }

    return this.loaderElementRef;
  }
}
