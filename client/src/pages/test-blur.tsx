export default function TestBlur() {
  return (
    <div className="min-h-screen bg-slate-900 text-white p-8">
      <h1 className="text-4xl font-bold mb-4">Blur Test Page</h1>
      <p className="text-lg mb-4">
        This is a simple test page to check if text appears blurry.
        If this text looks crisp, the issue is with specific components.
      </p>
      <div className="border border-white p-4 mb-4">
        <h2 className="text-2xl mb-2">Test Box</h2>
        <p>Sharp borders and text should be visible here.</p>
      </div>
      <button className="bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded">
        Test Button
      </button>
    </div>
  );
}