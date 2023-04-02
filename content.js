const styleId = 'secretTagsExtension';
const extensionCss = `
  .secretTagsSwitchWrapper {
  }
  .secretTagsSwitch {
    margin-top: 12px;
    width: 24px;
    height: 24px;
    background-size: contain;
    border-radius: 12px;
    cursor: pointer;
  }
`;

function insertStyle() {
  const head = document.head || document.getElementsByTagName('head')[0];
  const style = document.createElement('style');
  head.appendChild(style);
  style.id = styleId;
  style.appendChild(document.createTextNode(extensionCss));
}

const secretTagsURL = '/tag/%D1%81%D0%B5%D0%BA%D1%80%D0%B5%D1%82%D0%BD%D1%8B%D0%B5+%D1%80%D0%B0%D0%B7%D0%B4%D0%B5%D0%BB%D1%8B/rating';
const statusURLRegex = /^.*Blog\/(.*)\?token=(.*)$/

function getSecretTagsStatus() {
  return fetch(secretTagsURL)
    .then(response => response.text())
    .then(html => {
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, 'text/html');
      const isSubscribed = !!doc.querySelector('.remove_from_fav');
      const changeStatusURL = doc.querySelector('.change_favorite_link').href;
      const [, blogIdMatch, ] = changeStatusURL.match(statusURLRegex);
      const blogId = blogIdMatch.split('/')[0]; // can be 'id/1' in case of sub link or just 'id' in case of unsub
      return { isSubscribed, blogId, changeStatusURL};
    });
}

async function insertSwitch() {
  const { isSubscribed, blogId, changeStatusURL } = await getSecretTagsStatus();
  const bgImageUrl = `/pics/avatar/tag/${blogId}`;

  const switchWrapper = document.createElement('div');
  switchWrapper.className = 'secretTagsSwitchWrapper';
  const switchDiv = document.createElement('img')
  switchDiv.className = 'secretTagsSwitch';
  switchDiv.src = bgImageUrl;
  switchWrapper.appendChild(switchDiv);

  if(!isSubscribed) {
    switchDiv.style.opacity = '0.3';
  }

  switchDiv.addEventListener('click', () => {
    fetch(changeStatusURL).then(() => location.reload());
  })

  const sfwSwitcher = document.querySelector('.swf_switcher');
  sfwSwitcher.insertAdjacentElement('afterend', switchWrapper);
}

insertStyle();
insertSwitch();
