/**
 parse markdown的core代码credit属于https://github.com/dobiz365
 研究markdown，改着玩
**/


window.onload = function() {


  var textEditor = document.getElementById('editor');

  textEditor.addEventListener('input', function(){
    var resultDiv = document.getElementsByClassName('md_result')[0];
    var text = textEditor.value;
    resultDiv.innerHTML = parse(text);
  });


  function parse(src){
    var dest=[];

    var i=0;

    var arr=src.split("\n");

    while(i<arr.length){
      var s=arr[i];
      var temp=s.split(' ');
      var ltype=getcmd(s);
      if(ltype=='h1' || ltype=='h2' || ltype=='h3' || ltype=='h4' || ltype=='h5' || ltype=='h6'){//一级标题
        temp.shift();
        if(temp.length>0){
          var temp_s=parse_inline(temp.join(' ').replace(/\</g,'&lt;'));
          dest.push('<'+ltype+'>'+temp_s+'</'+ltype+'>\n');
        }
      }else if(ltype=='quote'){//引用

        var dddd=[];
        do{
          temp.shift();
          if(temp.length>0){
            var temp_s=parse_inline(temp.join(' ').replace(/\</g,'&lt;'));
            dddd.push(temp_s+'<br/>');
          }
          i++;
          if(i>=arr.length) break;
          s=arr[i];
          temp=s.split(' ');
          ltype=getcmd(s);
        }while(ltype=="quote");
        dest.push('<div class="markdown_preview_quote_div"><p>'+dddd.join("\n")+'</p></div>\n');
        i--;
      }else if(ltype=='ol'){//有序列表
        var t=[];
        t.push('<ol>');
        do{
          temp.shift();
          if(temp.length>0){
            t.push('<li>'+parse_inline(temp.join(' ').replace(/\</g,'&lt;'))+'</li>');
          }
          i++;
          if(i>=arr.length) break;
          s=arr[i];
          temp=s.split(' ');
          ltype=getcmd(s);
        }while(ltype=='ol');
        t.push('</ol>');
        dest.push(t.join("\n")+"\n");
        i--;
      }else if(ltype=='ul'){//无序列表
        var t=[];
        t.push('<ul>');
        do{
          temp.shift();
          if(temp.length>0){
            t.push('<li>'+parse_inline(temp.join(' ').replace(/\</g,'&lt;'))+'</li>');
          }
          i++;
          if(i>=arr.length) break;
          s=arr[i];
          temp=s.split(' ');
          ltype=getcmd(s);
        }while(ltype=='ul');
        t.push('</ul>');
        dest.push(t.join("\n")+"\n");
        i--;
      }else if(ltype=='program1'){
        var t=[];
        var tou='<pre class="line-numbers"><code class="language-js">';
        do{
          t.push(s.substring(4));
          i++;
          if(i>=arr.length) break;
          s=arr[i];
          temp=s.split(' ');
          ltype=getcmd(s);
        }while(ltype=='program1');
        wei='</code></pre>\n';
        dest.push(tou+t.join("\n").replace(/\</g,'&lt;')+wei);
        i--;
      }else if(ltype=='program'){//代码高亮
        language=s.substr(3,400).trim();
        var lan=['php','js','cpp','java','css','html','python'];
        var ii=-1;
        for(var ti=0;ti<lan.length;ti++){
          if(lan[ti]==language){
            ii=ti;
            break;
          }
        }
        if(ii==-1) language='js';
        dest.push('<pre class="line-numbers"><code class="language-'+language+'">');
        i++;
        while(i<arr.length){
          var ss=arr[i].split(' ');
          ltype=getcmd(arr[i]);
          if(ltype=='program'){
            break;
          }else{
            var dm=arr[i].replace(/\</g,'&lt;');
            dest.push(dm+"\n");
            i++;
          }
        }
        dest.push('</code></pre>\n');

      }else if(ltype=='table'){
        var t=[];
        t.push('<table cellspacing="0" cellpadding="0">');
        var th=s.split('|');
        t.push('<tr>');
        for(var j=0;j<th.length;j++) if(th[j].trim()!='') t.push('<th>'+th[j].replace(/\</g,'&lt;')+'</th>');
        t.push('</tr>');
        i++;
        if(i>=arr.length) s='';
          else s=arr[i];
        temp=s.split(' ');
        ltype=getcmd(s);
        while(ltype=='table'){
          t.push('<tr>');
          var td=s.split('|');
          for(var m=0;m<td.length;m++) if(td[m].trim()!='') t.push('<td>'+td[m].replace(/\</g,'&lt;')+'</td>');
          t.push('</tr>');
          i++;
          if(i>=arr.length) break;
          s=arr[i];
          temp=s.split(' ');
          ltype=getcmd(s);
        }
        t.push('</table>');
        dest.push(t.join("\n"));
        i--;
      }else if(ltype=='hr'){
        dest.push('<hr>');
      }else{
        if(s.trim()==''){
            if(s.substring(0,2)=='  '){//必须两个空格加换行转为<br/>
              dest.push('<br/>');
            }
        }else{
          dest.push('<p>'+parse_inline(s)+'</p>\n');
        }
      }
      i++;
    }

    return dest.join("");
  }

  /**
  功能：根据输入字符串确定命令类型
  参数：t		输入字符串
  返回：命令
  h1 h2 h3 h4 h5 h6		标题
  quote					引用
  program					代码
  p						文本
  hr						分隔线
  ul						无序列表
  ol						有序列表
  */
  function getcmd(s){
    temp=s.split(' ');
    t=temp[0];
    if(t=='#') {
      return 'h1';
    }else if(t=='##') {
      return 'h2';
    }else if(t=='###') {
      return 'h3';
    }else if(t=='####') {
      return 'h4';
    }else if(t=='#####') {
      return 'h5';
    }else if(t=='######') {
      return 'h6';
    }else if(t=='>') {
      return 'quote';
    }else if(t=='-' || t=='+') {
      return 'ul';
    }else if(t=='|'){
      return 'table';
    }
    if(s.substring(0,4)=='    '){
      return 'program1';
    }
    var reg=/^[```]{3}/;
    if(reg.test(t)){
      return 'program';
    }
    var reg=/^[\d]+?\. /;
    if(reg.test(t)){
      return 'ol';
    }
    reg=/^[\-]{3,}/;
    if(reg.test(t)){
      return 'hr';
    }
    return 'p';
  }
  /**
  功能：解释行内命令
  参数：src 输入的marktx字符
  返回：解释后的HTML字符
  行内命令有：图片 ![]()，加粗 ** **    倾斜* * 链接[]()  行内代码` `
  */
  function parse_inline(src){
    var reg=/!\[(.*?)\]\((.*?)\)/gi;
    src=src.replace(reg,'<img src="$2" alt="$1"/>');
    reg=/\[(.*?)\]\((.*?)\)/gi;
    src=src.replace(reg,'<a href="$2" target="_blank">$1</a>');
    reg=/\*\*(.*?)\*\*/gi;
    src=src.replace(reg,'<b>$1</b>');
    reg=/\*(.*?)\*/gi;
    src=src.replace(reg,'<i>$1</i>');
    reg=/`(.*?)`/gi;
    src=src.replace(reg,'<code>$1</code>');
    return src;
  }
}
