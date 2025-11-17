/**
 * Trading Page Header Component
 * Main header with gradient title and description
 */
export default function PageHeader() {
  return (
    <div className="text-center mb-8 page-header">
      <h1 className="text-4xl font-bold mb-4 text-white">
        <span className="bg-gradient-to-r from-purple-400 via-cyan-400 to-pink-400 bg-clip-text text-transparent">
          NebulaX Trading Platform
        </span>
      </h1>
      <p className="text-xl text-muted-foreground">
        Advanced tools for both beginners and professional traders
      </p>
    </div>
  );
}
