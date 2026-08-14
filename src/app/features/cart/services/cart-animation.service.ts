import { Injectable, signal, ElementRef, Renderer2, RendererFactory2 } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CartAnimationService {
  private renderer: Renderer2;
  private desktopCartRef: ElementRef | null = null;
  private mobileCartRef: ElementRef | null = null;

  public desktopCartJiggle$ = signal<boolean>(false);
  public mobileCartJiggle$ = signal<boolean>(false);

  constructor(rendererFactory: RendererFactory2) {
    this.renderer = rendererFactory.createRenderer(null, null);
  }

  public registerDesktopCart(el: ElementRef) {
    this.desktopCartRef = el;
  }

  public registerMobileCart(el: ElementRef) {
    this.mobileCartRef = el;
  }

  public animateToCart(event: MouseEvent, imageUrl: string) {
    const isMobile = window.innerWidth < 1024; // Tailwind lg breakpoint
    const targetRef = isMobile ? this.mobileCartRef : this.desktopCartRef;

    if (!targetRef || !document) return;

    const startX = event.clientX;
    const startY = event.clientY;

    const cartRect = targetRef.nativeElement.getBoundingClientRect();
    const endX = cartRect.left + cartRect.width / 2;
    const endY = cartRect.top + cartRect.height / 2;

    // Create wrapper for Y arc animation
    const wrapper = this.renderer.createElement('div');
    this.renderer.setStyle(wrapper, 'position', 'fixed');
    this.renderer.setStyle(wrapper, 'z-index', '9999');
    this.renderer.setStyle(wrapper, 'left', `${startX}px`);
    this.renderer.setStyle(wrapper, 'top', `${startY}px`);
    this.renderer.setStyle(wrapper, 'pointer-events', 'none');

    // Create flying image
    const img = this.renderer.createElement('img');
    this.renderer.setAttribute(img, 'src', imageUrl);
    this.renderer.setStyle(img, 'width', '50px');
    this.renderer.setStyle(img, 'height', '50px');
    this.renderer.setStyle(img, 'border-radius', '50%');
    this.renderer.setStyle(img, 'object-fit', 'cover');
    this.renderer.setStyle(img, 'transform', 'translate(-50%, -50%)');
    this.renderer.setStyle(img, 'box-shadow', '0 4px 12px rgba(0,0,0,0.2)');

    this.renderer.appendChild(wrapper, img);
    this.renderer.appendChild(document.body, wrapper);

    const deltaX = endX - startX;
    const deltaY = endY - startY;

    // Y arc animation
    wrapper.animate([
      { transform: `translateY(0px)` },
      { transform: `translateY(${deltaY}px)` }
    ], {
      duration: 700,
      easing: 'cubic-bezier(0.2, -0.3, 0.8, 1)',
      fill: 'forwards'
    });

    // X linear animation
    const xAnimation = img.animate([
      { transform: `translate(-50%, -50%) translateX(0px) scale(1)`, opacity: 1 },
      { transform: `translate(-50%, -50%) translateX(${deltaX}px) scale(0.2)`, opacity: 0.8 }
    ], {
      duration: 700,
      easing: 'linear',
      fill: 'forwards'
    });

    xAnimation.onfinish = () => {
      this.renderer.removeChild(document.body, wrapper);
      if (isMobile) {
        this.triggerMobileJiggle();
      } else {
        this.triggerDesktopJiggle();
      }
    };
  }

  private triggerDesktopJiggle() {
    this.desktopCartJiggle$.set(true);
    setTimeout(() => this.desktopCartJiggle$.set(false), 500);
  }

  private triggerMobileJiggle() {
    this.mobileCartJiggle$.set(true);
    setTimeout(() => this.mobileCartJiggle$.set(false), 500);
  }
}
