{
  description = "carbon-cv";

  inputs = {
    nixpkgs.url = "nixpkgs/nixpkgs-unstable";
    utils.url = "github:numtide/flake-utils";
  };

  outputs = { self, nixpkgs, utils }: utils.lib.eachDefaultSystem (system:
    let
      pkgs = import nixpkgs { inherit system; };
      inherit (pkgs) chromium mkShell nodePackages;
      inherit (nodePackages) pnpm prettier;
    in
    {
      devShells.default = mkShell {
        packages = [ chromium pnpm prettier ];
      };
    });
}
