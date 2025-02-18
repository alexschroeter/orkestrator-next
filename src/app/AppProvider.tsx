import { AlpakaWard } from "@/alpaka/AlpakaWard";
import { Arkitekt, Guard } from "@/arkitekt/Arkitekt";
import { CommandMenu } from "@/command/Menu";
import { ModuleLayout } from "@/components/layout/ModuleLayout";
import { PageLayout } from "@/components/layout/PageLayout";
import { Button } from "@/components/ui/button";
import { Toaster } from "@/components/ui/sonner";
import { ShadnWigets } from "@/components/widgets/ShadnWigets";
import { baseName, Router, WELL_KNOWN_ENDPOINTS } from "@/constants";
import { KabinetWard } from "@/kabinet/KabinetWard";
import { KraphWard } from "@/kraph/KraphWard";
import { WellKnownDiscovery } from "@/lib/fakts";
import { SystemMessageDisplay } from "@/lok-next/SystemMessage";
import { MikroNextWard } from "@/mikro-next/MikroNextWard";
import ImageDisplay from "@/mikro-next/displays/ImageDisplay";
import { ThemeProvider } from "@/providers/ThemeProvider";
import { CommandProvider } from "@/providers/command/CommandProvider";
import { DebugProvider } from "@/providers/debug/DebugProvider";
import { DisplayProvider } from "@/providers/display/DisplayProvider";
import { SelectionProvider } from "@/providers/selection/SelectionProvider";
import { SettingsProvider } from "@/providers/settings/SettingsProvider";
import { SmartProvider } from "@/providers/smart/provider";
import { FlussWard } from "@/reaktion/FlussWard";
import { RekuestNextWard } from "@/rekuest/RekuestNextWard";
import NodeDisplay from "@/rekuest/components/displays/NodeDisplay";
import { AssignationUpdater } from "@/rekuest/components/functional/AssignationUpdater";
import { ReservationUpdater } from "@/rekuest/components/functional/ReservationUpdater";
import { WidgetRegistryProvider } from "@/rekuest/widgets/WidgetsProvider";
import { ErrorBoundary, FallbackProps } from "react-error-boundary";
import { useNavigate } from "react-router-dom";

const displayRegistry = {
  "@mikro-next/image": ImageDisplay,
  "@rekuest/node": NodeDisplay,
};

function fallbackRender({ error, resetErrorBoundary }: FallbackProps) {
  // Call resetErrorBoundary() to reset the error boundary and retry the render.

  return (
    <ModuleLayout pane={<>ohhhh boy, this is embarrassing</>}>
      <PageLayout title="Test">
        <div className="h-full w-full flex flex-col items-center justify-center">
          <div className="text-6xl text-muted-foreground mb-3">😬</div>
          <div className="text-2xl font-bold mb-5">
            Oh boy this is embarrassing
          </div>

          <p>Something went wrong:</p>
          <pre style={{ color: "red" }} className="my-5">
            {error.message}
          </pre>

          <p className="text-muted-foreground mb-2">
            You can try to go back and try again. But please let us know about
            this...
          </p>
          <Button variant={"outline"} onClick={resetErrorBoundary}>
            Go back again
          </Button>
        </div>
      </PageLayout>
    </ModuleLayout>
  );
}

export const BackNavigationErrorCatcher = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const navigate = useNavigate();

  return (
    <ErrorBoundary
      fallbackRender={fallbackRender}
      onReset={() => {
        console.log("Resetting error boundary");
        navigate(-1);
      }}
    >
      {children}
    </ErrorBoundary>
  );
};

// The AppProvider is the root component of the application.
// It is responsible for providing all the context providers that are used in the application.
// It wraps the Easy Provider, which allows for the configuration of an Easy App through Arkitekt,
// Additionally, it wraps the DisplayProvider, which allows for the configuration of the display registry.
export const AppProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <SettingsProvider>
      <DebugProvider>
        <Router basename={baseName}>
          <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
            {/* This is where we configure the application automatically based on facts */}

            <Arkitekt.Provider>
              <DisplayProvider registry={displayRegistry}>
                <WellKnownDiscovery
                  endpoints={WELL_KNOWN_ENDPOINTS} // this configures fakts to use the well known endpoints in order to discover the other services
                />
                <SelectionProvider>
                  <CommandProvider>
                    <SmartProvider>
                      <WidgetRegistryProvider>
                        <CommandMenu />
                        <Guard.Rekuest fallback={<></>}>
                          {/* Here we registed both the GraphQL Postman that will take care of assignments, and reserverations */}
                          <AssignationUpdater />
                          <ReservationUpdater />
                          {/* We register the Shadn powered widgets to the widget registry. */}
                          <RekuestNextWard />
                          <ShadnWigets />
                          <Toaster />
                        </Guard.Rekuest>
                        <Guard.Kabinet fallback={<></>}>
                          <KabinetWard key="kabinet" />
                        </Guard.Kabinet>
                        <Guard.Kraph fallback={<></>}>
                          <KraphWard key="kraph" />
                        </Guard.Kraph>
                        <Guard.Alpaka fallback={<></>}>
                          <AlpakaWard key="alpaka" />
                        </Guard.Alpaka>
                        <Guard.Mikro fallback={<></>}>
                          <MikroNextWard key="mikro" />
                        </Guard.Mikro>
                        <Guard.Fluss fallback={<></>}>
                          <FlussWard key="fluss" />
                        </Guard.Fluss>
                        <Guard.Lok fallback={<></>}>
                          <SystemMessageDisplay />
                        </Guard.Lok>
                        <BackNavigationErrorCatcher>
                          {children}
                        </BackNavigationErrorCatcher>
                      </WidgetRegistryProvider>
                    </SmartProvider>
                  </CommandProvider>
                </SelectionProvider>
              </DisplayProvider>
            </Arkitekt.Provider>
          </ThemeProvider>
        </Router>
      </DebugProvider>
    </SettingsProvider>
  );
};
