// tsup.config.ts
import { defineConfig } from "tsup";
import { exec } from "child_process";
var tsup_config_default = defineConfig((options) => ({
  entry: {
    index: "./src/index.ts"
  },
  format: ["esm", "cjs"],
  dts: false,
  treeshake: true,
  splitting: true,
  clean: !options.watch,
  onSuccess: async () => {
    exec("tsc --emitDeclarationOnly --declaration", (err) => {
      if (err) {
        console.error(err);
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
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidHN1cC5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9faW5qZWN0ZWRfZmlsZW5hbWVfXyA9IFwiL1VzZXJzL2V2YW4vRG9jdW1lbnRzL2Zyb250ZW5kTWFpbi9wYW5jYWtlLWZyb250ZW5kL3BhY2thZ2VzL3N3YXAtc2RrLWNvcmUvdHN1cC5jb25maWcudHNcIjtjb25zdCBfX2luamVjdGVkX2Rpcm5hbWVfXyA9IFwiL1VzZXJzL2V2YW4vRG9jdW1lbnRzL2Zyb250ZW5kTWFpbi9wYW5jYWtlLWZyb250ZW5kL3BhY2thZ2VzL3N3YXAtc2RrLWNvcmVcIjtjb25zdCBfX2luamVjdGVkX2ltcG9ydF9tZXRhX3VybF9fID0gXCJmaWxlOi8vL1VzZXJzL2V2YW4vRG9jdW1lbnRzL2Zyb250ZW5kTWFpbi9wYW5jYWtlLWZyb250ZW5kL3BhY2thZ2VzL3N3YXAtc2RrLWNvcmUvdHN1cC5jb25maWcudHNcIjtpbXBvcnQgeyBkZWZpbmVDb25maWcgfSBmcm9tICd0c3VwJ1xuaW1wb3J0IHsgZXhlYyB9IGZyb20gJ2NoaWxkX3Byb2Nlc3MnXG5cbmV4cG9ydCBkZWZhdWx0IGRlZmluZUNvbmZpZygob3B0aW9ucykgPT4gKHtcbiAgZW50cnk6IHtcbiAgICBpbmRleDogJy4vc3JjL2luZGV4LnRzJyxcbiAgfSxcbiAgZm9ybWF0OiBbJ2VzbScsICdjanMnXSxcbiAgZHRzOiBmYWxzZSxcbiAgdHJlZXNoYWtlOiB0cnVlLFxuICBzcGxpdHRpbmc6IHRydWUsXG4gIGNsZWFuOiAhb3B0aW9ucy53YXRjaCxcbiAgb25TdWNjZXNzOiBhc3luYyAoKSA9PiB7XG4gICAgZXhlYygndHNjIC0tZW1pdERlY2xhcmF0aW9uT25seSAtLWRlY2xhcmF0aW9uJywgKGVycikgPT4ge1xuICAgICAgaWYgKGVycikge1xuICAgICAgICBjb25zb2xlLmVycm9yKGVycilcbiAgICAgICAgaWYgKCFvcHRpb25zLndhdGNoKSB7XG4gICAgICAgICAgcHJvY2Vzcy5leGl0KDEpXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9KVxuICB9LFxufSkpXG4iXSwKICAibWFwcGluZ3MiOiAiO0FBQTRXLFNBQVMsb0JBQW9CO0FBQ3pZLFNBQVMsWUFBWTtBQUVyQixJQUFPLHNCQUFRLGFBQWEsQ0FBQyxhQUFhO0FBQUEsRUFDeEMsT0FBTztBQUFBLElBQ0wsT0FBTztBQUFBLEVBQ1Q7QUFBQSxFQUNBLFFBQVEsQ0FBQyxPQUFPLEtBQUs7QUFBQSxFQUNyQixLQUFLO0FBQUEsRUFDTCxXQUFXO0FBQUEsRUFDWCxXQUFXO0FBQUEsRUFDWCxPQUFPLENBQUMsUUFBUTtBQUFBLEVBQ2hCLFdBQVcsWUFBWTtBQUNyQixTQUFLLDJDQUEyQyxDQUFDLFFBQVE7QUFDdkQsVUFBSSxLQUFLO0FBQ1AsZ0JBQVEsTUFBTSxHQUFHO0FBQ2pCLFlBQUksQ0FBQyxRQUFRLE9BQU87QUFDbEIsa0JBQVEsS0FBSyxDQUFDO0FBQUEsUUFDaEI7QUFBQSxNQUNGO0FBQUEsSUFDRixDQUFDO0FBQUEsRUFDSDtBQUNGLEVBQUU7IiwKICAibmFtZXMiOiBbXQp9Cg==
