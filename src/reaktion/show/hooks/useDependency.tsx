import { useShowRiver } from "../context";

export const useDependency = (id: string) => {
  const { template } = useShowRiver();

  const dependency = template?.dependencies.find((r) => r.reference === id);

  return dependency;
};
