module.exports = {
  title: 'Biasbuster',
  tagline: 'AI-powered platform for detecting and mitigating bias',
  url: 'https://yourdomain.com',
  baseUrl: '/',
  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',
  favicon: 'img/favicon.ico',
  organizationName: 'your-org', // Usually your GitHub org/user name.
  projectName: 'biasbuster', // Usually your repo name.
  themeConfig: {
    navbar: {
      title: 'Biasbuster',
      logo: {
        alt: 'Biasbuster Logo',
        src: 'img/logo.svg',
      },
      items: [
        {to: 'docs/index', label: 'Docs', position: 'left'},
        {to: 'blog', label: 'Blog', position: 'left'},
        {
          href: 'https://github.com/your-org/biasbuster',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Docs',
          items: [
            {label: 'Getting Started', to: 'docs/index'},
            {label: 'API', to: 'docs/api'},
            {label: 'BMAD Methodology', to: 'docs/bmads/bmads-methodology'},
          ],
        },
        {
          title: 'Community',
          items: [
            {label: 'GitHub', href: 'https://github.com/your-org/biasbuster'},
            {label: 'Twitter', href: 'https://twitter.com/biasbuster'},
          ],
        },
        {
          title: 'More',
          items: [
            {label: 'Blog', to: 'blog'},
            {label: 'Privacy Policy', to: 'docs/compliance/privacy-policy'},
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} Biasbuster. Built with Docusaurus.`,
    },
  },
  presets: [
    [
      '@docusaurus/preset-classic',
      {
        docs: {
          sidebarPath: require.resolve('./sidebars.js'),
          editUrl:
            'https://github.com/your-org/biasbuster/edit/main/',
        },
        blog: {
          showReadingTime: true,
          editUrl:
            'https://github.com/your-org/biasbuster/edit/main/blog/',
        },
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      },
    ],
  ],
};
