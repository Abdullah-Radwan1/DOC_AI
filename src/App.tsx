import { RouterProvider } from "@tanstack/react-router";
import { router, queryClient } from "./routes/router";
import { AuthProvider } from "@/hooks/useAuth";
import { QueryClientProvider } from "@tanstack/react-query";

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
