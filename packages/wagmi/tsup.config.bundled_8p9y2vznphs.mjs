// tsup.config.ts
import { defineConfig } from "tsup";
var tsup_config_default = defineConfig({
  entry: {
    index: "src/index.ts",
    "connectors/miniProgram": "connectors/miniProgram/index.ts",
    "connectors/binanceWallet": "connectors/binanceWallet/index.ts",
    "connectors/blocto": "connectors/blocto/index.ts",
    "connectors/trustWallet": "connectors/trustWallet/index.ts"
  },
  treeshake: true,
  splitting: true,
  format: ["esm", "cjs"],
  dts: true
});
export {
  tsup_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidHN1cC5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9faW5qZWN0ZWRfZmlsZW5hbWVfXyA9IFwiL1VzZXJzL2ZvcmV2ZXI5L0NvZGUvcHJvamVjdHMvZnVzaW9ueC9mdXNpb254LWZyb250ZW5kL3BhY2thZ2VzL3dhZ21pL3RzdXAuY29uZmlnLnRzXCI7Y29uc3QgX19pbmplY3RlZF9kaXJuYW1lX18gPSBcIi9Vc2Vycy9mb3JldmVyOS9Db2RlL3Byb2plY3RzL2Z1c2lvbngvZnVzaW9ueC1mcm9udGVuZC9wYWNrYWdlcy93YWdtaVwiO2NvbnN0IF9faW5qZWN0ZWRfaW1wb3J0X21ldGFfdXJsX18gPSBcImZpbGU6Ly8vVXNlcnMvZm9yZXZlcjkvQ29kZS9wcm9qZWN0cy9mdXNpb254L2Z1c2lvbngtZnJvbnRlbmQvcGFja2FnZXMvd2FnbWkvdHN1cC5jb25maWcudHNcIjtpbXBvcnQgeyBkZWZpbmVDb25maWcgfSBmcm9tICd0c3VwJ1xuXG5leHBvcnQgZGVmYXVsdCBkZWZpbmVDb25maWcoe1xuICBlbnRyeToge1xuICAgIGluZGV4OiAnc3JjL2luZGV4LnRzJyxcbiAgICAnY29ubmVjdG9ycy9taW5pUHJvZ3JhbSc6ICdjb25uZWN0b3JzL21pbmlQcm9ncmFtL2luZGV4LnRzJyxcbiAgICAnY29ubmVjdG9ycy9iaW5hbmNlV2FsbGV0JzogJ2Nvbm5lY3RvcnMvYmluYW5jZVdhbGxldC9pbmRleC50cycsXG4gICAgJ2Nvbm5lY3RvcnMvYmxvY3RvJzogJ2Nvbm5lY3RvcnMvYmxvY3RvL2luZGV4LnRzJyxcbiAgICAnY29ubmVjdG9ycy90cnVzdFdhbGxldCc6ICdjb25uZWN0b3JzL3RydXN0V2FsbGV0L2luZGV4LnRzJyxcbiAgfSxcbiAgdHJlZXNoYWtlOiB0cnVlLFxuICBzcGxpdHRpbmc6IHRydWUsXG4gIGZvcm1hdDogWydlc20nLCAnY2pzJ10sXG4gIGR0czogdHJ1ZSxcbn0pXG4iXSwKICAibWFwcGluZ3MiOiAiO0FBQTZWLFNBQVMsb0JBQW9CO0FBRTFYLElBQU8sc0JBQVEsYUFBYTtBQUFBLEVBQzFCLE9BQU87QUFBQSxJQUNMLE9BQU87QUFBQSxJQUNQLDBCQUEwQjtBQUFBLElBQzFCLDRCQUE0QjtBQUFBLElBQzVCLHFCQUFxQjtBQUFBLElBQ3JCLDBCQUEwQjtBQUFBLEVBQzVCO0FBQUEsRUFDQSxXQUFXO0FBQUEsRUFDWCxXQUFXO0FBQUEsRUFDWCxRQUFRLENBQUMsT0FBTyxLQUFLO0FBQUEsRUFDckIsS0FBSztBQUNQLENBQUM7IiwKICAibmFtZXMiOiBbXQp9Cg==
