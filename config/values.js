/**
 * Project Configuration.
 *
 * NOTE: All file/folder paths should be relative to the project root. The
 * absolute paths should be resolved during runtime by our build internal/server.
 */

import path from 'path';
import fs from 'fs';
import appRootDir from 'app-root-dir';

import * as EnvVars from './utils/envVars';
import CliVar from './utils/cliVar';

/**
 * Construct the fully qualified URL to our local API.
 * Assumes we're using HTTP in dev and HTTPS when not
 */
function defaultLocalApiUrl(envValue = '') {

  // Hack, since Heroku doesn't allow for disabling env inheritance unless you
  // specify a non-empty string value. So, in app.json we give LOCAL_API_URL a
  // value of " " and check that here ¯\_(ツ)_/¯
  if (envValue.trim() !== '') {
    return envValue.trim();
  }

  const herokuAppName = EnvVars.string('HEROKU_APP_NAME', '');
  // If running on Heroku and app name is available (defined in app.json), use that
  if (herokuAppName !== '') {
    return `https://${herokuAppName}.herokuapp.com/api`;
  }

  const port = EnvVars.number('PORT', 3000);

  return EnvVars.string('API_URL', `http://localhost:${port}/api`);
}

function defaultClientLocalApiUrl(envValue = '', localApiUrl = '') {
  if (envValue && envValue !== '') {
    return envValue;
  }

  const isClientDevProxy = EnvVars.bool('CLIENT_DEV_PROXY', false);

  if (isClientDevProxy) {
    return '/api';
  }

  if (localApiUrl && localApiUrl !== '') {
    return localApiUrl;
  }

  return '/api';
}

const localApiUrl = defaultLocalApiUrl(EnvVars.string('LOCAL_API_URL'));
const clientLocalApiUrl = defaultClientLocalApiUrl(EnvVars.string('CLIENT_LOCAL_API_URL'), localApiUrl);

console.info('Local API served from %s', localApiUrl);

if (localApiUrl !== clientLocalApiUrl) {
  console.info('Client API served from %s', clientLocalApiUrl);
}

const values = {
  // The configuration values that should be exposed to our client bundle.
  // This value gets passed through the /shared/utils/objects/filterWithRules
  // util to create a filter object that can be serialised and included
  // with our client bundle.
  clientConfigFilter: {
    // This is here as an example showing that you can expose variables
    // that were potentially provivded by the environment
    welcomeMessage: true,
    // We only need to expose the enabled flag of the service worker.
    serviceWorker: {
      enabled: true,
    },
    // We need to expose all the polyfill.io settings.
    polyfillIO: true,
    // We need to expose all the htmlPage settings.
    helmet: true,

    clientLocalApiUrl: true,

    // Google Analytics is initialized on the client.
    gaId: true,
    // Expose heroku devtools flag
    herokuDevtools: true,
  },

  contentfulSpace: EnvVars.string('CONTENTFUL_SPACE', 'c1g5jo7yk12v'),
  contenfulAccessToken: EnvVars.string('CONTENTFUL_ACCESS_TOKEN', '57ad9105103318b3998d16a6a1aa3b56f780c3329ca4caeeb41c7bb1c46e2ed3'),
  contentfulCache: true,
  contentfulCachePrefix: 'contentful',
  contentfulCacheTime: 60 * 60 * 24,
  localApiUrl,
  clientLocalApiUrl,

  // The public facing url of the app
  publicUrl: EnvVars.string('PUBLIC_URL'),

  // The host on which the server should bind to.
  host: EnvVars.string('HOST', 'localhost'),

  // The port on which the server should bind to.
  port: EnvVars.number('PORT', 3000),

  // Should the webpack dev server be proxied through the public url
  clientDevProxy: EnvVars.bool('CLIENT_DEV_PROXY', false),

  // The port on which the client bundle development server should run.
  clientDevServerPort: EnvVars.number('CLIENT_DEV_PORT', 7331),

  // This is an example environment variable which is used within the react
  // application to demonstrate the usage of environment variables across
  // the client and server bundles.
  welcomeMessage: EnvVars.string('WELCOME_MSG', 'Nothing feels like ::ffff!'),

  // Expose environment
  NODE_ENV: EnvVars.string('NODE_ENV', 'development'),

  // Are we measuring performance?
  performance: EnvVars.bool('PERFORMANCE', false),

  // Enable node-notifier?
  notifier: EnvVars.string('NOTIFIER', 'warn'),

  // Toggle devtools on heroku
  herokuDevtools: EnvVars.bool('HEROKU_DEVTOOLS', false),

  passwordProtect: EnvVars.string('PASSWORD_PROTECT', ''),

  // Disable server side rendering?
  disableSSR: false,

  // How long should we set the browser cache for the served assets?
  // Don't worry, we add hashes to the files, so if they change the new files
  // will be served to browsers.
  // We are using the "ms" format to set the length.
  // @see https://www.npmjs.com/package/ms
  browserCacheMaxAge: '365d',

  // Enforce HTTPS when behind a load balancer/external router (e.g. Heroku)
  // redirects all requests to their https counterparts
  enforceHttps: EnvVars.bool('ENFORCE_HTTPS', false),

  // Analytics properties
  gaId: EnvVars.string('GA_ID', ''),
  facebookPixel: EnvVars.string('FACEBOOK_PIXEL', ''),
  twitterPixel: EnvVars.string('TWITTER_PIXEL', ''),

  // We use the polyfill.io service which provides the polyfills that a
  // client needs, which is far more optimal than the large output
  // generated by babel-polyfill.
  // Note: we have to keep this seperate from our "htmlPage" configuration
  // as the polyfill needs to be loaded BEFORE any of our other javascript
  // gets parsed.
  polyfillIO: {
    enabled: true,
    url: '//cdn.polyfill.io/v2/polyfill.min.js',
    // Reference https://qa.polyfill.io/v2/docs/features for a full list
    // of features.
    features: [
      // The default list.
      'default',
      'es6',
    ],
  },

  // Basic configuration for the HTML page that hosts our application.
  // We make use of react-helmet to consume the values below.
  // @see https://github.com/nfl/react-helmet
  helmet: {
    htmlAttributes: {
      lang: 'en',
    },
    title: 'Home',
    titleTemplate: 'Lorem Ipsum - %s',
    meta: [
      /*
        A great reference for favicons:
        https://github.com/audreyr/favicon-cheat-sheet
        It's a pain to manage/generate them. I run both these in order,
        and combine their results:
        http://realfavicongenerator.net/
        http://www.favicomatic.com/
      */
      { httpEquiv: 'X-UA-Compatible', content: 'IE=edge' },
      { name: 'description', content: 'Contentful demo project' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { name: 'msapplication-TileColor', content: '#00E2AD' },
      { name: 'msapplication-TileImage', content: '/favicons/mstile-150x150.png' },
      { name: 'msapplication-square70x70logo', content: '/favicons/mstile-70x70.png' },
      { name: 'msapplication-square150x150logo', content: '/favicons/mstile-150x150.png' },
      { name: 'msapplication-wide310x150logo', content: '/favicons/mstile-310x150.png' },
      { name: 'msapplication-square310x310logo', content: '/favicons/mstile-310x310.png' },
      { name: 'theme-color', content: '#00E2AD' },
      { property: 'og:image', content: '/favicons/android-chrome-192x192.png' },
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:image', content: '/favicons/android-chrome-192x192.png' },
      { name: 'twitter:site', content: '@ueno' },
      { name: 'twitter:creator', content: '@ueno' },
      { name: 'twitter:description', content: 'Contentful demo project' },
      { name: 'twitter:title', content: 'Ueno.' },
    ],
    link: [
      { rel: 'apple-touch-icon-precomposed', sizes: '152x152', href: '/favicons/apple-touch-icon-152x152.png' },
      { rel: 'apple-touch-icon-precomposed', sizes: '144x144', href: '/favicons/apple-touch-icon-144x144.png' },
      { rel: 'apple-touch-icon-precomposed', sizes: '120x120', href: '/favicons/apple-touch-icon-120x120.png' },
      { rel: 'apple-touch-icon-precomposed', sizes: '114x114', href: '/favicons/apple-touch-icon-114x114.png' },
      { rel: 'apple-touch-icon-precomposed', sizes: '76x76', href: '/favicons/apple-touch-icon-76x76.png' },
      { rel: 'apple-touch-icon-precomposed', sizes: '72x72', href: '/favicons/apple-touch-icon-72x72.png' },
      { rel: 'apple-touch-icon-precomposed', sizes: '57x57', href: '/favicons/apple-touch-icon-57x57.png' },
      { rel: 'apple-touch-icon-precomposed', sizes: '60x60', href: '/favicons/apple-touch-icon-60x60.png' },
      { rel: 'apple-touch-icon', sizes: '180x180', href: '/favicons/apple-touch-icon-180x180.png' },
      { rel: 'mask-icon', href: '/favicons/safari-pinned-tab.svg', color: '#00a9d9' },
      { rel: 'icon', type: 'image/png', href: '/favicons/favicon-196x196.png', sizes: '196x196' },
      { rel: 'icon', type: 'image/png', href: '/favicons/favicon-128.png', sizes: '128x128' },
      { rel: 'icon', type: 'image/png', href: '/favicons/favicon-96x96.png', sizes: '96x96' },
      { rel: 'icon', type: 'image/png', href: '/favicons/favicon-32x32.png', sizes: '32x32' },
      { rel: 'icon', sizes: '16x16 32x32', href: '/favicon.ico' },
      { rel: 'manifest', href: '/manifest.json' },
    ],
  },

  // Content Security Policy (CSP)
  // @see server/middleware/security for more info.
  cspExtensions: {
    childSrc: [],
    connectSrc: ['ws:', 'swapi.co'],
    defaultSrc: [],
    fontSrc: ['fonts.googleapis.com/css', 'fonts.gstatic.com'],
    imgSrc: [
      '*.facebook.com',
      '*.google-analytics.com',
      't.co',
    ],
    mediaSrc: [],
    manifestSrc: [],
    objectSrc: [],
    scriptSrc: [
      "'self'",
      // Allow scripts from cdn.polyfill.io so that we can import the polyfill.
      'cdn.polyfill.io',
      // For analytics
      '*.google-analytics.com',
      'connect.facebook.net',
      'static.ads-twitter.com',
      'analytics.twitter.com',
    ],
    styleSrc: [
      "'self' 'unsafe-inline'",
      'fonts.googleapis.com',
      'blob:',
    ],
  },

  // Path to the public assets that will be served off the root of the
  // HTTP server.
  publicAssetsPath: './public',

  // Where does our build output live?
  buildOutputPath: './build',

  // Which sourcemaps to use in development mode.
  // See https://webpack.js.org/configuration/devtool/ for latest info
  // about build speeds vs accuracity.
  sourcemap: 'source-map',

  // Do you want to included source maps for optimised builds of the client
  // bundle?
  includeSourceMapsForOptimisedClientBundle: false,

  // These extensions are tried when resolving src files for our bundles..
  bundleSrcTypes: ['js', 'jsx', 'json'],

  // Additional asset types to be supported for our bundles.
  // i.e. you can import the following file types within your source and the
  // webpack bundling process will bundle them with your source and create
  // URLs for them that can be resolved at runtime.
  bundleAssetTypes: [
    'jpg',
    'jpeg',
    'png',
    'gif',
    'ico',
    'eot',
    'ttf',
    'woff',
    'woff2',
    'otf',
    'mp4',
    'webm',
  ],

  // What should we name the json output file that webpack generates
  // containing details of all output files for a bundle?
  bundleAssetsFileName: 'assets.json',

  // node_modules are not included in any bundles that target "node" as a
  // runtime (e.g.. the server bundle) as including them often breaks builds
  // due to thinks like require statements containing expressions..
  // However. some of the modules contain files need to be processed by
  // one of our Webpack loaders (e.g. CSS). Add any file types to the list
  // below to allow them to be processed by Webpack.
  nodeExternalsFileTypeWhitelist: [
    /\.(eot|woff|woff2|ttf|otf)$/,
    /\.(svg|png|jpg|jpeg|gif|ico)$/,
    /\.(mp4|mp3|ogg|swf|webp)$/,
    /\.(css|scss|sass|sss|less)$/,
  ],

  // Note: you can only have a single service worker instance.  Our service
  // worker implementation is bound to the "client" and "server" bundles.
  // It includes the "client" bundle assets, as well as the public folder assets,
  // and it is served by the "server" bundle.
  serviceWorker: {
    // Enabled?
    enabled: false,
    // Service worker name
    fileName: 'sw.js',
    // Paths to the public assets which should be included within our
    // service worker. Relative to our public folder path, and accepts glob
    // syntax.
    includePublicAssets: [
      // NOTE: This will include ALL of our public folder assets.  We do
      // a glob pull of them and then map them to /foo paths as all the
      // public folder assets get served off the root of our application.
      // You may or may not want to be including these assets.  Feel free
      // to remove this or instead include only a very specific set of
      // assets.
      './**/*',
    ],
    // Offline page file name.
    offlinePageFileName: 'offline.html',
  },

  bundles: {
    client: {
      // Src entry file.
      srcEntryFile: './client/index.js',

      // Src paths.
      srcPaths: [
        './client',
        './shared',
        // The service worker offline page generation needs access to the
        // config folder.  Don't worry we have guards within the config files
        // to ensure they never get included in a client bundle.
        './config',
      ],

      // Where does the client bundle output live?
      outputPath: './build/client',

      // What is the public http path at which we must serve the bundle from?
      webPath: '/client/',

      // Configuration settings for the development vendor DLL.  This will be created
      // by our development server and provides an improved dev experience
      // by decreasing the number of modules that webpack needs to process
      // for every rebuild of our client bundle.  It by default uses the
      // dependencies configured in package.json however you can customise
      // which of these dependencies are excluded, whilst also being able to
      // specify the inclusion of additional modules below.
      devVendorDLL: {
        // Enabled?
        enabled: true,

        // Specify any dependencies that you would like to include in the
        // Vendor DLL.
        //
        // NOTE: It is also possible that some modules require specific
        // webpack loaders in order to be processed (e.g. CSS/SASS etc).
        // For these cases you don't want to include them in the Vendor DLL.
        include: [
          'react-async-bootstrapper',
          'react-async-component',
          'react-jobs',
          'react',
          'react-dom',
          'react-ga',
          'react-helmet',
          'react-router-dom',
          'mobx',
          'mobx-react',
          'core-decorators',
        ],

        // The name of the vendor DLL.
        name: '__dev_vendor_dll__',
      },
    },

    server: {
      // Src entry file.
      srcEntryFile: './server/index.js',

      // Src paths.
      srcPaths: ['./server', './shared', './config'],

      // Where does the server bundle output live?
      outputPath: './build/server',
    },
  },

  additionalNodeBundles: {
    // NOTE: The webpack configuration and build scripts have been built so
    // that you can add arbitrary additional node bundle configurations here.
    //
    // A common requirement for larger projects is to add additional "node"
    // target bundles (e.g an APi server endpoint). Therefore flexibility has been
    // baked into our webpack config factory to allow for this.
    //
    // Simply define additional configurations similar to below.  The development
    // server will manage starting them up for you.  The only requirement is that
    // within the entry for each bundle you create and return the "express"
    // listener.
    /*
    apiServer: {
      srcEntryFile: './api/index.js',
      srcPaths: [
        './api',
        './shared',
        './config',
      ],
      outputPath: './build/api',
    }
    */
  },

  // These plugin definitions provide you with advanced hooks into customising
  // the project without having to reach into the internals of the tools.
  //
  // We have decided to create this plugin approach so that you can come to
  // a centralised configuration folder to do most of your application
  // configuration adjustments.  Additionally it helps to make merging
  // from the origin starter kit a bit easier.
  plugins: {
    // This plugin allows you to provide final adjustments your babel
    // configurations for each bundle before they get processed.
    //
    // This function will be called once for each for your bundles.  It will be
    // provided the current webpack config, as well as the buildOptions which
    // detail which bundle and mode is being targetted for the current function run.
    babelConfig: (babelConfig, buildOptions) => {
      // eslint-disable-next-line no-unused-vars
      const { target, mode } = buildOptions;
      const { presets, plugins } = babelConfig;

      // Example
      /*
      if (target === 'server' && mode === 'development') {
        babelConfig.presets.push('foo');
      }
     */

      // Decorators for everybody
      plugins.push('transform-decorators-legacy');

      // Remove stage-# prests
      presets.forEach((val, pos) => String(val).match(/stage-\d/) && presets.splice(pos, 1));
      // Add stage-0 to list of presets
      presets.push('stage-0');

      return babelConfig;
    },

    // This plugin allows you to provide final adjustments your webpack
    // configurations for each bundle before they get processed.
    //
    // I would recommend looking at the "webpack-merge" module to help you with
    // merging modifications to each config.
    //
    // This function will be called once for each for your bundles.  It will be
    // provided the current webpack config, as well as the buildOptions which
    // detail which bundle and mode is being targetted for the current function run.
    webpackConfig: (webpackConfig, buildOptions) => {
      // eslint-disable-next-line no-unused-vars
      const { target, mode } = buildOptions;

      // we assume resolve to be an object with an `alias` object we can add to
      const { resolve } = webpackConfig;

      // Example:
      /*
      if (target === 'server' && mode === 'development') {
        webpackConfig.plugins.push(new MyCoolWebpackPlugin());
      }
      */

      // Debugging/Logging Example:
      /*
      if (target === 'server') {
        console.log(JSON.stringify(webpackConfig, null, 4));
      }
      */

      // Hook up possible single route development
      const route = CliVar('route');
      if (mode === 'development' && route) {
        const routePath = path.resolve(appRootDir.get(), `shared/routes/${route}`);

        // we can call sync function here since it's only in development
        const routeIsValid = route && route !== '' && fs.existsSync(routePath);

        if (routeIsValid) {
          const resolvedApp = path.resolve(appRootDir.get(), 'shared/SingleRouteApp');

          resolve.alias.route = routePath;
          resolve.alias.App = resolvedApp;

          console.info(`==> Routing all requests to the "${route}" route`);
        } else {
          console.warn(`Unable to resolve route "${route}" at ${routePath}`);
          resolve.alias.App = path.resolve(appRootDir.get(), 'shared/MainApp');
        }
      } else {
        resolve.alias.App = path.resolve(appRootDir.get(), 'shared/MainApp');
      }

      return webpackConfig;
    },
  },
};

// This protects us from accidentally including this configuration in our
// client bundle. That would be a big NO NO to do. :)
if (process.env.BUILD_FLAG_IS_CLIENT === 'true') {
  throw new Error(
    "You shouldn't be importing the `<projectroot>/config/values.js` directly into code that will be included in your 'client' bundle as the configuration object will be sent to user's browsers. This could be a security risk! Instead, use the `config` helper function located at `<projectroot>/config/index.js`.",
  );
}

export default values;
