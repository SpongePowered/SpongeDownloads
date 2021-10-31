import {faDownload, faCode, faGraduationCap, faArchive, faWrench} from '@fortawesome/free-solid-svg-icons'

export const Labels = {
  recommended: {
    name: "Recommended",
    color: 'success',
    title: "Recommended build"
  },
  latest: {
    name: "Latest",
    color: 'success',
    title: "Latest build"
  },
};

const ArtifactTypes = {
  Main: {
    name: "Main",
    classifier: '',
    icon: faDownload,
    title: "Download"
  },
  Sources: {
    name: "Sources",
    classifier: 'sources',
    icon: faCode,
    title: "Download the source code"
  },
  Javadocs: {
    name: "Javadocs",
    classifier: 'javadoc',
    icon: faGraduationCap,
    title: "Download the Java API documentation"
  },
  Shaded: {
    name: "Shaded",
    classifier: 'shaded',
    icon: faArchive,
    title: "Download a package with all dependencies"
  },
  DevShaded: {
    name: "Dev",
    classifier: 'dev-shaded',
    icon: faWrench,
    title: "Download an un-obfuscated build with all dependencies for testing in a development environment"
  }
};

export const Platforms = {
  spongevanilla: {
    group: 'org.spongepowered',
    id: 'spongevanilla',
    name: "SpongeVanilla",
    suffix: "Vanilla",
    description: "SpongeVanilla is the implementation of the Sponge API on top of Vanilla Minecraft.",
    recommendation: "Recommended for running plugins without Forge mods.",
    tags: {
      api: {
        name: "api"
      },
      minecraft: {
        name: "minecraft"
      },
    },
    artifactTypes: [
      ArtifactTypes.Main,
      ArtifactTypes.Sources,
      ArtifactTypes.DevShaded
    ]
  },
  spongeforge: {
    group: 'org.spongepowered',
    id: 'spongeforge',
    name: "SpongeForge",
    suffix: "Forge",
    description: "SpongeForge is the implementation of the Sponge API on the Minecraft Forge platform.",
    recommendation: "Recommended for running plugins together with Forge mods.",
    tags: {
      api: {
        name: "api"
      },
      forge: {
        name: "forge",
        display: true,
        color: 'forge',
        transform: function(value) {
          if (value === "2838") {
            return "Works with 2855";
          }
          return value;
        }
      },
      minecraft: {
        name: "minecraft"
      },
    },
    artifactTypes: [
      ArtifactTypes.Main,
      ArtifactTypes.Sources,
      ArtifactTypes.DevShaded
    ]
  },
};
