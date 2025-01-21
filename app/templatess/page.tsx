import Templates from '@/components/Templates'

export default function Home() {
  return (
    <main className="container mx-auto p-4 flex flex-col items-center justify-center min-h-screen">
      <div className="flex flex-col items-center justify-center w-full">
      <h1 className="text-4xl font-bold mb-8">All Saved Templates</h1>
        <Templates />
      </div>
    </main>
  );
}
