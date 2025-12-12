import { DocsContainer as ContainerBlock } from "@storybook/addon-docs";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

const DocsContainer = ({ children, context }) => (
  <ContainerBlock context={context}>
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  </ContainerBlock>
);

export default DocsContainer;
