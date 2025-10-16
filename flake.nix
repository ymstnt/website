{
  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";
  };

  outputs =
    inputs: with inputs; {
      packages = nixpkgs.lib.genAttrs [ "x86_64-linux" "aarch64-linux" ] (
        system:
        let
          pkgs = import nixpkgs { inherit system; };
        in
        {
          default = pkgs.stdenvNoCC.mkDerivation (finalAttrs: {
            pname = "ymstnt-website";
            version = builtins.substring 0 8 self.lastModifiedDate or "dirty";

            src = ./.;

            nativeBuildInputs = with pkgs; [
              zola
            ];

            buildPhase = ''
              runHook preBuild

              cp -r ${finalAttrs.passthru.duckquill}/* themes/duckquill/
              chmod +w -R themes/duckquill

              zola build --output-dir $out

              runHook postBuild
            '';

            passthru = {
              duckquill = pkgs.fetchFromGitea {
                domain = "codeberg.org";
                owner = "daudix";
                repo = "duckquill";
                tag = "v6.2.0";
                hash = "sha256-IpJ1cmkSGEBycGPc+O/pGbVDWWB0KSla12SPoL1HMbw=";
              };
            };
          });
        }
      );
    };
}
