-- CreateTable
CREATE TABLE "course_orders" (
    "id" UUID NOT NULL,
    "razorpay_order_id" TEXT,
    "razorpay_payment_id" TEXT,
    "lms_course_id" TEXT NOT NULL,
    "course_slug" TEXT NOT NULL,
    "course_title" TEXT NOT NULL,
    "amount" INTEGER NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'INR',
    "buyer_email" TEXT NOT NULL,
    "buyer_name" TEXT NOT NULL,
    "buyer_phone" TEXT,
    "status" TEXT NOT NULL DEFAULT 'created',
    "webhook_status" TEXT,
    "utm_source" TEXT,
    "utm_medium" TEXT,
    "utm_campaign" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "course_orders_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "webhook_deliveries" (
    "id" UUID NOT NULL,
    "order_id" UUID NOT NULL,
    "attempt" INTEGER NOT NULL,
    "status_code" INTEGER,
    "response_body" TEXT,
    "error" TEXT,
    "delivered_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "webhook_deliveries_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "course_orders_razorpay_order_id_key" ON "course_orders"("razorpay_order_id");

-- AddForeignKey
ALTER TABLE "webhook_deliveries" ADD CONSTRAINT "webhook_deliveries_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "course_orders"("id") ON DELETE CASCADE ON UPDATE CASCADE;

