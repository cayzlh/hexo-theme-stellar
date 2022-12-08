'use strict';

function layoutNodeTitle(content) {
  var el = '';
  el += '<div class="header">';
  if (content && content.length > 0) {
    el += hexo.render.renderSync({text: content, engine: 'markdown'}).split('\n').join('');
  }
  el += '</div>';
  return el;
}

function layoutNodeContent(content) {
  var el = '';
  el += '<div class="body fs14">';
  if (content && content.length > 0) {
    el += hexo.render.renderSync({text: content, engine: 'markdown'}).split('\n').join('');
  }
  el += '</div>';
  return el;
}

function postSpeakLine(args, content) {
  <!-- 只显示某个人的数据 -->
  /*{% timeline user:xaoxuu api:https://api.github.com/repos/volantis-x/hexo-theme-volantis/issues %}{% endtimeline %}*/
  <!-- 筛选最近3条todo -->
  /*{% timeline api:https://api.github.com/repos/xaoxuu/hexo-theme-stellar/issues?labels=todo&per_page=3 %}{% endtimeline %}*/
  <!-- 筛选评论最多的3条建议 -->
  /*{% timeline api:https://api.github.com/repos/volantis-x/hexo-theme-volantis/issues?labels=feature-request&per_page=3&sort=comments %}{% endtimeline %}*/
  // https://api.speak.cayzlh.com/api/ispeak?author=633ee4eaa3fa60f68c752aa2&page=1&pageSize=6
  args = hexo.args.map(args, ['api']);
  var el = '';
  if (!args.type) {
    args.type = 'speak';
  }
  if (args.api && args.api.length > 0) {
    el += '<div class="tag-plugin timeline stellar-' + args.type + '-api"';
    el += ' ' + hexo.args.joinTags(args, ['api']).join(' ');
    el += '>';
  } else {
    el += '<div class="tag-plugin timeline">';
  }

  var arr = content.split(/<!--\s*node (.*?)\s*-->/g).filter(item => item.trim().length > 0)
  if (arr.length > 0) {
    var nodes = [];
    arr.forEach((item, i) => {
      if (i % 2 == 0) {
        nodes.push({
          header: item
        });
      } else if (nodes.length > 0) {
        var node = nodes[nodes.length-1];
        if (node.body == undefined) {
          node.body = item;
        } else {
          node.body += '\n' + item;
        }
      }
    });
    nodes.forEach((node, i) => {
      el += '<div class="timenode" index="' + (i) + '">';
      el += layoutNodeTitle(node.header);
      el += layoutNodeContent(node.body);
      el += '</div>';
    });
  }

  el += '</div>';
  return el;
}

hexo.extend.tag.register('speak', postSpeakLine, {ends: true});
