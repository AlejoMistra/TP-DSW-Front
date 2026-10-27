export function LazyLoadingFallback() {
  return (
    <div className="flex flex-col items-center justify-center min-h-100">
      <div className="flex flex-col items-center gap-4">
        <div className="animate-spin rounded-full h-10 w-10 border-2 border-primary border-t-transparent" />
        <p className="text-sm text-muted-foreground">Cargando contenido...</p>
      </div>
    </div>
  );
}