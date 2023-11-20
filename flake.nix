{
  description = "carbon-cv";

  inputs = {
    nixpkgs.url = "nixpkgs/nixpkgs-unstable";
    utils.url = "github:numtide/flake-utils";
  };

  outputs = { self, nixpkgs, utils }: {
    overlays.default = final: _: {
      carbon-cv = final.buildGoModule {
        pname = "carbon-cv";
        version = "0.1.0";
        src = builtins.path { path = ./.; name = "carbon-cv-src"; };
        vendorHash = "sha256-5Egm91TjYJireK4USAwbAvmpdhV8RXVCX8yVphxdo+E=";
        nativeBuildInputs = [ final.remarshal ];
        preBuild = ''
          make schema.json
        '';
        postInstall = ''
          mv $out/bin/carboncv $out/bin/carbon-cv
          mkdir -p $out/share/doc
          cp schema.{json,yaml} $out/share/doc/
        '';
      };
    };
  } // utils.lib.eachDefaultSystem (system:
    let
      pkgs = import nixpkgs {
        overlays = [ self.overlays.default ];
        inherit system;
      };
      inherit (pkgs) carbon-cv go gopls mkShell nodePackages remarshal
        yaml-language-server;
    in
    {
      packages.default = carbon-cv;

      devShells.default = mkShell {
        packages = [
          go
          gopls
          nodePackages.prettier
          remarshal
          yaml-language-server
        ];
      };
    });
}
