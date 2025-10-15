import CryptoPayment from "@/components/crypto/crypto-payment";

export default function CryptoPaymentPage() {
  return (
    <div className="min-h-screen page-content pt-4">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-8 page-header">
          <h1 className="text-4xl font-bold mb-4">
            <span className="bg-gradient-to-r from-blue-400 via-green-400 to-yellow-400 bg-clip-text text-transparent">
              Crypto Payments
            </span>
          </h1>
          <p className="text-xl text-muted-foreground">
            Fast, secure cryptocurrency deposits with real-time confirmation tracking
          </p>
        </div>

        <CryptoPayment />
      </div>
    </div>
  );
}