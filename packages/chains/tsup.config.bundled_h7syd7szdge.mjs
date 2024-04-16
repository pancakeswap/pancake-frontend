// tsup.config.ts
import { defineConfig } from "tsup";
import { exec } from "child_process";
var tsup_config_default = defineConfig((options) => ({
  entry: {
    index: "./src/index.ts"
  },
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
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidHN1cC5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9faW5qZWN0ZWRfZmlsZW5hbWVfXyA9IFwiL1VzZXJzL3BoaS93b3JrL3BhbmNha2UtZnJvbnRlbmQvcGFja2FnZXMvY2hhaW5zL3RzdXAuY29uZmlnLnRzXCI7Y29uc3QgX19pbmplY3RlZF9kaXJuYW1lX18gPSBcIi9Vc2Vycy9waGkvd29yay9wYW5jYWtlLWZyb250ZW5kL3BhY2thZ2VzL2NoYWluc1wiO2NvbnN0IF9faW5qZWN0ZWRfaW1wb3J0X21ldGFfdXJsX18gPSBcImZpbGU6Ly8vVXNlcnMvcGhpL3dvcmsvcGFuY2FrZS1mcm9udGVuZC9wYWNrYWdlcy9jaGFpbnMvdHN1cC5jb25maWcudHNcIjtpbXBvcnQgeyBkZWZpbmVDb25maWcgfSBmcm9tICd0c3VwJ1xuaW1wb3J0IHsgZXhlYyB9IGZyb20gJ2NoaWxkX3Byb2Nlc3MnXG5cbmV4cG9ydCBkZWZhdWx0IGRlZmluZUNvbmZpZygob3B0aW9ucykgPT4gKHtcbiAgZW50cnk6IHtcbiAgICBpbmRleDogJy4vc3JjL2luZGV4LnRzJyxcbiAgfSxcbiAgZm9ybWF0OiBbJ2VzbScsICdjanMnXSxcbiAgZHRzOiBmYWxzZSxcbiAgY2xlYW46ICFvcHRpb25zLndhdGNoLFxuICB0cmVlc2hha2U6IHRydWUsXG4gIHNwbGl0dGluZzogdHJ1ZSxcbiAgb25TdWNjZXNzOiBhc3luYyAoKSA9PiB7XG4gICAgZXhlYygndHNjIC0tZW1pdERlY2xhcmF0aW9uT25seSAtLWRlY2xhcmF0aW9uJywgKGVyciwgc3Rkb3V0KSA9PiB7XG4gICAgICBpZiAoZXJyKSB7XG4gICAgICAgIGNvbnNvbGUuZXJyb3Ioc3Rkb3V0KVxuICAgICAgICBpZiAoIW9wdGlvbnMud2F0Y2gpIHtcbiAgICAgICAgICBwcm9jZXNzLmV4aXQoMSlcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0pXG4gIH0sXG59KSlcbiJdLAogICJtYXBwaW5ncyI6ICI7QUFBOFIsU0FBUyxvQkFBb0I7QUFDM1QsU0FBUyxZQUFZO0FBRXJCLElBQU8sc0JBQVEsYUFBYSxDQUFDLGFBQWE7QUFBQSxFQUN4QyxPQUFPO0FBQUEsSUFDTCxPQUFPO0FBQUEsRUFDVDtBQUFBLEVBQ0EsUUFBUSxDQUFDLE9BQU8sS0FBSztBQUFBLEVBQ3JCLEtBQUs7QUFBQSxFQUNMLE9BQU8sQ0FBQyxRQUFRO0FBQUEsRUFDaEIsV0FBVztBQUFBLEVBQ1gsV0FBVztBQUFBLEVBQ1gsV0FBVyxZQUFZO0FBQ3JCLFNBQUssMkNBQTJDLENBQUMsS0FBSyxXQUFXO0FBQy9ELFVBQUksS0FBSztBQUNQLGdCQUFRLE1BQU0sTUFBTTtBQUNwQixZQUFJLENBQUMsUUFBUSxPQUFPO0FBQ2xCLGtCQUFRLEtBQUssQ0FBQztBQUFBLFFBQ2hCO0FBQUEsTUFDRjtBQUFBLElBQ0YsQ0FBQztBQUFBLEVBQ0g7QUFDRixFQUFFOyIsCiAgIm5hbWVzIjogW10KfQo=
