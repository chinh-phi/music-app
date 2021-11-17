import AbstractView from "./AbstractView.js";
// import {categoryItems} from "./Category.js";
export default class extends AbstractView {
  constructor(params) {
    super(params);
    this.slug = params.slug;
    this.setTitle("Category Details");
  }

  async getHtml(content) {
    const topic = this.slug.toUpperCase();
    $.ajax({
      url: `http://localhost:3000/api/category/${this.slug}`,
      contentType: 'application/json',
      success: function (response) {
        const header = `<div class="category-container">
                          <h2 class="category-header">${topic}</h2>
                          <div class="category-content">
                            <div class="category-list row">
                                      
                            </div>
                          </div>
                        </div>
                      `
        content.html(header);
        const categoryContent = $('.category-list.row');
        const htmls = response.map((category, index) => {
          return `
                    <a href="/music/singer/${category.slug}" class="category-item-singer">
                      <img src="${category.img}" alt=""
                        class="category-photo category-photo-singer">
                      <div class="category-name category-name-singer">${category.name}</div>
                    </a>
                  `
        })
        categoryContent.html(htmls.join(""));
      }
    })
  }
}

