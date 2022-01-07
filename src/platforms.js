import {faDownload, faCode, faGraduationCap, faArchive, faWrench} from '@fortawesome/free-solid-svg-icons'
import VersionSort from './versort';

export const Labels = {
  recommended: {
    name: "Recommended",
    color: 'success',
    title: "Recommended build"
  },
  experimental: {
    name: "Experimental",
    color: 'warning',
    title: "Experimental"
  },
  latest: {
    name: "Latest",
    color: 'success',
    title: "Latest build"
  },
};

const ArtifactTypes = {
  Main: {
    name: "Download",
    legacyClassifier: '',
    classifier: 'universal',
    icon: faDownload,
    title: "Download",
    primary: true
  },
  Sources: {
    name: "Sources",
    legacyClassifier: 'sources',
    classifier: 'sources-dev',
    icon: faCode,
    title: "Download the source code"
  },
  Javadocs: {
    name: "Javadocs",
    legacyClassifier: 'javadoc',
    classifier: '',
    icon: faGraduationCap,
    title: "Download the Java API documentation"
  },
  Shaded: {
    name: "Shaded",
    legacyClassifier: 'shaded',
    classifier: null,
    icon: faArchive,
    title: "Download a package with all dependencies"
  },
  DevShaded: {
    name: "Dev",
    legacyClassifier: 'dev-shaded',
    classifier: null,
    icon: faWrench,
    title: "Download an un-obfuscated build with all dependencies for testing in a development environment"
  }
};

// Version to function
const spongeQueryModifiers = {
  // force API 7, unfortunately things aren't sorted by date here and all API-8 builds are useless.
  "1.12": query => query["api"] = 7,
  "1.12.1": query => query["api"] = 7,
  "1.12.2": query => query["api"] = 7,
  "1.11.2": query => query["api"] = 6,
  "1.11": query => query["api"] = 6,
  "1.10": query => query["api"] = 5,
  "1.10.2": query => query["api"] = 5
};

const legacyMcVersions = [
  "1.8.",
  "1.9.",
  "1.10.",
  "1.11.",
  "1.12."
]

const mcIsLegacyCheck = tags => {
  return ("minecraft" in tags && legacyMcVersions.findIndex(x => tags["minecraft"].startsWith(x)) !== -1)
}

const markExperimental = version => {
  const ver = version.toLowerCase();
  return ver.includes("0.0-rc") || ver.includes("snapshot");
}

export const Platforms = {
  spongevanilla: {
    group: 'org.spongepowered',
    id: 'spongevanilla',
    name: "SpongeVanilla",
    suffix: "Vanilla",
    featured: true,
    description: "Not using any mods? SpongeVanilla is for you!",
    recommendation: "Recommended for running plugins without Forge mods.",
    queryModifiers: spongeQueryModifiers,
    tags: {
      api: {
        name: "api"
      },
      minecraft: {
        name: "minecraft",
        sort: VersionSort.sortVersions
      },
    },
    artifactTypes: [
      ArtifactTypes.Main,
      ArtifactTypes.Sources,
      ArtifactTypes.DevShaded
    ],
    checkIsLegacy: mcIsLegacyCheck,
    checkExperimental: markExperimental
  },
  spongeforge: {
    group: 'org.spongepowered',
    id: 'spongeforge',
    name: "SpongeForge",
    suffix: "Forge",
    featured: true,
    description: "Using Forge mods? Install the SpongeForge mod to use mods and plugins together!",
    recommendation: "Recommended for running plugins together with Forge mods.",
    queryModifiers: spongeQueryModifiers,
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
            return "Works with 2860";
          }
          return value;
        }
      },
      minecraft: {
        name: "minecraft",
        sort: VersionSort.sortVersions
      },
    },
    artifactTypes: [
      ArtifactTypes.Main,
      ArtifactTypes.Sources,
      ArtifactTypes.DevShaded
    ],
    checkIsLegacy: mcIsLegacyCheck,
    checkExperimental: markExperimental
  }
};
