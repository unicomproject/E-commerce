import re

file_path = r"c:\POS_PROPJECT\E-commerce\src\app\features\orders\pages\order-details\order-details.component.html"
backup_path = r"c:\POS_PROPJECT\E-commerce\src\app\features\orders\pages\order-details\order-details.component.html.bak"

# Read from backup to ensure we have a clean state to apply just option 2
with open(backup_path, 'r', encoding='utf-8') as f:
    content = f.read()

pattern = r"(@if\s*\(order\.canShowCollectionQr\s*&&\s*order\.collectionQr\)\s*\{)(.*?)(\}\s*@else\s*\{)"

replacement = r"""\1
          <div class="flex flex-col gap-6">
            <div class="bg-white rounded-2xl shadow-sm border border-neutral-100 p-6 flex flex-col items-center">
              <h4 class="font-bold text-brand-navy mb-3 text-center w-full">Collection QR</h4>
              <div class="bg-white p-2 rounded-lg shadow-sm border border-neutral-200">
                <qrcode [qrdata]="order.collectionQr" [width]="200" [errorCorrectionLevel]="'M'"></qrcode>
              </div>
              <p class="text-xs text-neutral-500 font-medium mt-3 text-center">Show this QR code at the store</p>
            </div>

            <div class="bg-white rounded-2xl shadow-sm border border-neutral-100 p-5 md:p-6 space-y-4 text-sm">
              <div class="flex justify-between border-b border-neutral-100 pb-3">
                <div class="flex items-center gap-2 text-neutral-500"><ng-icon name="lucideFileText"></ng-icon> Order Number</div>
                <div class="font-bold text-brand-navy flex items-center gap-2">
                  {{ order.displayOrderNumber }}
                  <button (click)="copyOrderId(order.orderNumber)" class="text-neutral-400 hover:text-brand-orange transition-colors"><ng-icon name="lucideCopy"></ng-icon></button>
                </div>
              </div>
              <div class="flex justify-between border-b border-neutral-100 pb-3">
                <div class="flex items-center gap-2 text-neutral-500"><ng-icon name="lucideMapPin"></ng-icon> Collection Point</div>
                <div class="font-semibold text-neutral-700 text-right">{{ order.outletName }}</div>
              </div>
              <div class="flex justify-between border-b border-neutral-100 pb-3">
                <div class="flex items-center gap-2 text-neutral-500"><ng-icon name="lucideCreditCard"></ng-icon> Payment</div>
                <div class="font-semibold text-neutral-700">{{ order.paymentLabel }}</div>
              </div>
              <div class="flex justify-between border-b border-neutral-100 pb-3">
                <div class="flex items-center gap-2 text-neutral-500"><ng-icon name="lucideCalendar"></ng-icon> Placed on</div>
                <div class="font-semibold text-neutral-700">{{ order.placedAt | date: 'dd MMM yyyy, hh:mm a' }}</div>
              </div>
              <div class="flex justify-between">
                <div class="flex items-center gap-2 text-neutral-500"><ng-icon name="lucideClock"></ng-icon> Pickup Time</div>
                <div class="font-semibold text-neutral-700 text-right">
                  {{ order.requestedCollectionAt | date: 'dd MMM yyyy, hh:mm a' }}
                  @if (order.requestedCollectionEndAt) { <span>- {{ order.requestedCollectionEndAt | date: 'hh:mm a' }}</span> }
                </div>
              </div>
              @if (order.status === 'PENDING_CONFIRMATION' || order.status === 'ACCEPTED') {
                <div class="pt-4 mt-4 border-t border-neutral-100 flex justify-end">
                  <button (click)="promptCancelOrder()" class="flex items-center gap-1.5 text-red-500 hover:text-red-600 font-semibold text-[13px] transition-colors active:scale-95"><ng-icon name="lucideXCircle" class="text-[16px]"></ng-icon> Cancel Order</button>
                </div>
              }
            </div>
          </div>
\3"""

new_content = re.sub(pattern, replacement, content, flags=re.DOTALL)

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(new_content)

print("Done")
