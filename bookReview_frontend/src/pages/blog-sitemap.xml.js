const EXTERNAL_DATA_URL_SKILLS = "https://upsc.joshtalks.org/api/v1/blogs";
const EXTERNAL_DATA_URL_UPSC = "https://upsc.joshtalks.org/api/v1/blogs";

function generateSiteMap(posts) {
   
  return `<?xml version="1.0" encoding="UTF-8"?>
   <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
     <!--We manually set the two URLs we know already-->
     <url>
       <loc>https://www.joshtalks.com/courses/english</loc>
     </url>
     <url>
       <loc>https://www.joshtalks.com/scholarships/upsc</loc>
     </url>
     <url>
       <loc>https://www.joshtalks.com/courses/english/dictionary</loc>
     </url>
     ${posts
       .map((item) => {
         return `
       <url>
           <loc>${`https://www.joshtalks.com/courses/english/blog/${item.slug}`}</loc>
       </url>
     `;
       })
       .join("")}
           ${posts
             .map((item) => {
               return `
       <url>
           <loc>${`https://www.joshtalks.com/scholarships/upsc/blog/${item.slug}`}</loc>
       </url>
     `;
             })
             .join("")}
   </urlset>
 `;
}

function SiteMap() {
  // getServerSideProps will do the heavy lifting
}

export async function getServerSideProps({ res }) {
  // We make an API call to gather the URLs for our site
    const sitemapUrls = [];

    let currentPage = 1;
    let totalPages = 0;


    do {
      const request = await fetch(
        `${EXTERNAL_DATA_URL_SKILLS}/?page_size=${currentPage}`
      );
      const response = await request.json();

      sitemapUrls.push(...response.results);

      totalPages = Math.ceil(response.count / 10);
      currentPage++;
    } while (currentPage <= totalPages);

  

//   const skillsposts = await Skillsrequest.json();


  // We generate the XML sitemap with the posts data
  const sitemap = generateSiteMap(sitemapUrls);

  res.setHeader("Content-Type", "text/xml");
  // we send the XML to the browser
  res.write(sitemap);
  res.end();

  return {
    props: {},
  };
}

export default SiteMap;
