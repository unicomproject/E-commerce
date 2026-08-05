import { Injectable, NgZone, inject } from '@angular/core';
import { environment } from '../../../environments/environment';

export type GoogleButtonText = 'signin_with' | 'signup_with' | 'continue_with';

export interface GoogleCredentialResponse {
  credential?: string;
  select_by?: string;
  state?: string;
}

interface GoogleIdentityConfiguration {
  client_id: string;
  callback: (response: GoogleCredentialResponse) => void;
  ux_mode?: 'popup';
  auto_select?: boolean;
}

interface GoogleButtonConfiguration {
  type?: 'standard' | 'icon';
  theme?: 'outline' | 'filled_blue' | 'filled_black';
  size?: 'large' | 'medium' | 'small';
  text?: GoogleButtonText;
  shape?: 'rectangular' | 'pill' | 'circle' | 'square';
  logo_alignment?: 'left' | 'center';
  width?: string;
}

interface GoogleIdentityApi {
  accounts: {
    id: {
      initialize(config: GoogleIdentityConfiguration): void;
      renderButton(parent: HTMLElement, options: GoogleButtonConfiguration): void;
      cancel(): void;
    };
  };
}

declare global {
  interface Window {
    google?: GoogleIdentityApi;
  }
}

@Injectable({
  providedIn: 'root'
})
export class GoogleIdentityService {
  private readonly ngZone = inject(NgZone);
  private readonly scriptId = 'google-identity-services-script';
  private readonly scriptUrl = 'https://accounts.google.com/gsi/client';
  private activeCredentialHandler: ((idToken: string) => void) | null = null;
  private initializedClientId: string | null = null;
  private loadScriptPromise: Promise<void> | null = null;

  get isConfigured(): boolean {
    return environment.googleClientId.trim().length > 0;
  }

  async renderButton(
    parent: HTMLElement,
    callback: (idToken: string) => void,
    text: GoogleButtonText
  ): Promise<void> {
    const clientId = environment.googleClientId.trim();
    if (!clientId) {
      throw new Error('Google Sign-In client id is not configured.');
    }

    await this.loadScript();

    if (!window.google?.accounts?.id) {
      throw new Error('Google Identity Services is not available.');
    }

    this.activeCredentialHandler = callback;
    this.initializeIfNeeded(clientId);

    parent.innerHTML = '';
    window.google.accounts.id.renderButton(parent, {
      type: 'standard',
      theme: 'outline',
      size: 'medium',
      text,
      shape: 'rectangular',
      logo_alignment: 'center',
      width: `${Math.min(parent.clientWidth || 400, 400)}`
    });
  }

  cancel(): void {
    window.google?.accounts?.id?.cancel();
  }

  private initializeIfNeeded(clientId: string): void {
    if (this.initializedClientId === clientId) {
      return;
    }

    window.google?.accounts?.id.initialize({
      client_id: clientId,
      ux_mode: 'popup',
      auto_select: false,
      callback: (response) => {
        const credential = response.credential;
        const handler = this.activeCredentialHandler;
        if (!credential || !handler) {
          return;
        }

        this.ngZone.run(() => handler(credential));
      }
    });

    this.initializedClientId = clientId;
  }

  private loadScript(): Promise<void> {
    if (window.google?.accounts?.id) {
      return Promise.resolve();
    }

    if (this.loadScriptPromise) {
      return this.loadScriptPromise;
    }

    const existingScript = document.getElementById(this.scriptId) as HTMLScriptElement | null;
    if (existingScript) {
      this.loadScriptPromise = new Promise<void>((resolve, reject) => {
        existingScript.addEventListener('load', () => resolve(), { once: true });
        existingScript.addEventListener('error', () => reject(new Error('Google Sign-In script failed to load.')), { once: true });
      });
      return this.loadScriptPromise;
    }

    this.loadScriptPromise = new Promise<void>((resolve, reject) => {
      const script = document.createElement('script');
      script.id = this.scriptId;
      script.src = this.scriptUrl;
      script.async = true;
      script.defer = true;
      script.onload = () => resolve();
      script.onerror = () => reject(new Error('Google Sign-In script failed to load.'));
      document.head.appendChild(script);
    });

    return this.loadScriptPromise;
  }
}