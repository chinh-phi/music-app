import AbstractView from "./AbstractView.js";

export default class extends AbstractView {
  constructor(params) {
    super(params);
    this.setTitle("Category");
  }

  async getHtml(content) {
    $.ajax({
      url: 'http://localhost:3000/api/category/data',
      contentType: 'application/json',
      success: function (response) {
        const header = `<div class="category-container">
                          <h2 class="category-header">All Categories</h2>
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
                  <a href="/music/category/${category.slug}" class="category-item">
                    <img src="${category.img}" alt="" class="category-photo">
                    <div class="category-name">${category.name}</div>
                  </a>
                `
        })
        categoryContent.html(htmls.join(""));
      }
    })
  }
}
