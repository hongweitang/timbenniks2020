const path = require('path')

function addStyleResource(rule) {
  rule
    .use('style-resource')
    .loader('style-resources-loader')
    .options({
      patterns: [
        path.resolve(__dirname, './src/styles/_packages.scss'),
        path.resolve(__dirname, './src/styles/_variables.scss'),
        path.resolve(__dirname, './src/styles/_mixins.scss'),
      ],
    })
}

module.exports = {
  siteName: 'Tim Benniks',
  siteUrl: 'https://timbenniks.nl',
  icon: './src/favicon.png',
  templates: {
    PrismicVideo: [
      {
        path: '/videos/:id',
        component: './src/templates/video.vue',
      },
    ],
    PrismicWriting: [
      {
        path: '/writings/:id',
        component: './src/templates/writing.vue',
      },
    ],
  },
  plugins: [
    {
      use: '@timbenniks/gridsome-source-prismic',
      options: {
        prismic_url: 'https://timbenniks.prismic.io/api/v2',
        prismic_token: process.env.PRISMIC_TOKEN,
        collection_prefix: 'Prismic',
        link_resolver: require('./src/prismic/linkResolver'),
        html_serializer: require('./src/prismic/htmlSerializer'),
      },
    },
    {
      use: '@gridsome/plugin-google-analytics',
      options: {
        id: 'UA-6797812-3',
      },
    },
    {
      use: '@gridsome/plugin-sitemap',
    },
    {
      use: 'gridsome-plugin-pwa',
      options: {
        title: 'Tim Benniks',
        disableServiceWorker: false,
        shortName: 'timbenniks.nl',
        themeColor: '#3590d5',
        backgroundColor: '#3590d5',
        icon: './src/favicon.png',
        msTileColor: '#3590d5',
      },
    },
    {
      use: 'gridsome-plugin-purgecss',
    },
    {
      use: 'gridsome-plugin-feed',
      options: {
        contentTypes: ['PrismicWriting'],
        feedOptions: {
          title: 'Tim Benniks',
          description:
            'This is the personal website of Tim Benniks. This is the place where you can find my public speaking schedule and where I share my opinions! Check out my videos and blog posts.',
        },

        nodeToFeedItem: (node) => ({
          title: node.data.title,
          date: new Date(node.data.publication_date),
          content: node.data.social_cards[0].content.description,
        }),
      },
    },
  ],
  chainWebpack(config) {
    const types = ['vue-modules', 'vue', 'normal-modules', 'normal']

    types.forEach((type) => {
      addStyleResource(config.module.rule('sass').oneOf(type))
    })

    types.forEach((type) => {
      addStyleResource(config.module.rule('scss').oneOf(type))
    })
  },
}
