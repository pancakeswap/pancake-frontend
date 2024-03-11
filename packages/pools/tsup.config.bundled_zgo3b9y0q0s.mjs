// tsup.config.ts
import { defineConfig } from "tsup";
import { exec } from "child_process";
var tsup_config_default = defineConfig((options) => ({
  entry: {
    index: "./src/index.ts"
  },
  sourcemap: true,
  noExternal: ["@pancakeswap/utils"],
  skipNodeModulesBundle: true,
  format: ["esm", "cjs"],
  dts: false,
  clean: !options.watch,
  treeshake: true,
  splitting: true,
  onSuccess: async () => {
    exec("tsc --emitDeclarationOnly --declaration", (err, stdout) => {
      if (err) {
        console.error(stdout);
        if (!options.watch) {
          process.exit(1);
        }
      }
    });
  }
}));
export {
  tsup_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidHN1cC5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9faW5qZWN0ZWRfZmlsZW5hbWVfXyA9IFwiL1VzZXJzL2ZvcmV2ZXI5L0NvZGUvcHJvamVjdHMvZnVzaW9ueC9mdXNpb254LWZyb250ZW5kL3BhY2thZ2VzL3Bvb2xzL3RzdXAuY29uZmlnLnRzXCI7Y29uc3QgX19pbmplY3RlZF9kaXJuYW1lX18gPSBcIi9Vc2Vycy9mb3JldmVyOS9Db2RlL3Byb2plY3RzL2Z1c2lvbngvZnVzaW9ueC1mcm9udGVuZC9wYWNrYWdlcy9wb29sc1wiO2NvbnN0IF9faW5qZWN0ZWRfaW1wb3J0X21ldGFfdXJsX18gPSBcImZpbGU6Ly8vVXNlcnMvZm9yZXZlcjkvQ29kZS9wcm9qZWN0cy9mdXNpb254L2Z1c2lvbngtZnJvbnRlbmQvcGFja2FnZXMvcG9vbHMvdHN1cC5jb25maWcudHNcIjtpbXBvcnQgeyBkZWZpbmVDb25maWcgfSBmcm9tICd0c3VwJ1xuaW1wb3J0IHsgZXhlYyB9IGZyb20gJ2NoaWxkX3Byb2Nlc3MnXG5cbmV4cG9ydCBkZWZhdWx0IGRlZmluZUNvbmZpZygob3B0aW9ucykgPT4gKHtcbiAgZW50cnk6IHtcbiAgICBpbmRleDogJy4vc3JjL2luZGV4LnRzJyxcbiAgfSxcbiAgc291cmNlbWFwOiB0cnVlLFxuICBub0V4dGVybmFsOiBbJ0BwYW5jYWtlc3dhcC91dGlscyddLFxuICBza2lwTm9kZU1vZHVsZXNCdW5kbGU6IHRydWUsXG4gIGZvcm1hdDogWydlc20nLCAnY2pzJ10sXG4gIGR0czogZmFsc2UsXG4gIGNsZWFuOiAhb3B0aW9ucy53YXRjaCxcbiAgdHJlZXNoYWtlOiB0cnVlLFxuICBzcGxpdHRpbmc6IHRydWUsXG4gIG9uU3VjY2VzczogYXN5bmMgKCkgPT4ge1xuICAgIGV4ZWMoJ3RzYyAtLWVtaXREZWNsYXJhdGlvbk9ubHkgLS1kZWNsYXJhdGlvbicsIChlcnIsIHN0ZG91dCkgPT4ge1xuICAgICAgaWYgKGVycikge1xuICAgICAgICBjb25zb2xlLmVycm9yKHN0ZG91dClcbiAgICAgICAgaWYgKCFvcHRpb25zLndhdGNoKSB7XG4gICAgICAgICAgcHJvY2Vzcy5leGl0KDEpXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9KVxuICB9LFxufSkpXG4iXSwKICAibWFwcGluZ3MiOiAiO0FBQTZWLFNBQVMsb0JBQW9CO0FBQzFYLFNBQVMsWUFBWTtBQUVyQixJQUFPLHNCQUFRLGFBQWEsQ0FBQyxhQUFhO0FBQUEsRUFDeEMsT0FBTztBQUFBLElBQ0wsT0FBTztBQUFBLEVBQ1Q7QUFBQSxFQUNBLFdBQVc7QUFBQSxFQUNYLFlBQVksQ0FBQyxvQkFBb0I7QUFBQSxFQUNqQyx1QkFBdUI7QUFBQSxFQUN2QixRQUFRLENBQUMsT0FBTyxLQUFLO0FBQUEsRUFDckIsS0FBSztBQUFBLEVBQ0wsT0FBTyxDQUFDLFFBQVE7QUFBQSxFQUNoQixXQUFXO0FBQUEsRUFDWCxXQUFXO0FBQUEsRUFDWCxXQUFXLFlBQVk7QUFDckIsU0FBSywyQ0FBMkMsQ0FBQyxLQUFLLFdBQVc7QUFDL0QsVUFBSSxLQUFLO0FBQ1AsZ0JBQVEsTUFBTSxNQUFNO0FBQ3BCLFlBQUksQ0FBQyxRQUFRLE9BQU87QUFDbEIsa0JBQVEsS0FBSyxDQUFDO0FBQUEsUUFDaEI7QUFBQSxNQUNGO0FBQUEsSUFDRixDQUFDO0FBQUEsRUFDSDtBQUNGLEVBQUU7IiwKICAibmFtZXMiOiBbXQp9Cg==
