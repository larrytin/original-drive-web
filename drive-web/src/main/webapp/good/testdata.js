/*var testData = [
 '我的云端硬盘',
 [ [ '视频', [ [ 'a' ], [ 'b' ], [ '小班', [ [ 'a' ], [ 'b' ] ] ] ] ],
 [ '音乐', [ [ 'a' ], [ 'b' ] ] ], [ '课件', [ [ 'a' ], [ 'b' ] ] ] ] ]*/
var testData1 = [
		['视频', [['a'], ['b'], ['小班', [['a'], ['b']]]]],
		['音乐', [['a'], ['b']]], ['课件', [['a'], ['b']]]];

function importData(mod) {
	var testmod = mod;
	var testdata = mod.getRoot();
	var rootlist = testmod.createList();
	var leaflist;

	testdata.set('folders', rootlist);

	rootlist = testmod.createList();
	rootlist.push('课件');
	leaflist = testmod.createList();
	leaflist.push('a');
	leaflist.push('b');
	leaflist.push('c');
	leaflist.push('d');
	rootlist.push(leaflist);
	testdata.get('folders').push(rootlist);

	rootlist = testmod.createList();
	rootlist.push('音乐');
	leaflist = testmod.createList();
	leaflist.push('a');
	leaflist.push('b');
	leaflist.push('c');
	leaflist.push('d');
	rootlist.push(leaflist);
	testdata.get('folders').push(rootlist);

	rootlist = testmod.createList();
	rootlist.push('科学');
	leaflist = testmod.createList();
	leaflist.push('a');
	leaflist.push('b');
	leaflist.push('c');
	leaflist.push('d');
	rootlist.push(leaflist);
	testdata.get('folders').push(rootlist);

	rootlist = testmod.createList();
	rootlist.push('社会');
	leaflist = testmod.createList();
	leaflist.push('a');
	leaflist.push('b');
	leaflist.push('c');
	leaflist.push('d');
	rootlist.push(leaflist);
	testdata.get('folders').push(rootlist);

	rootlist = testmod.createList();
	rootlist.push('一年级');
	leaflist = testmod.createList();
	leaflist.push('a');
	leaflist.push('b');
	leaflist.push('c');
	leaflist.push('d');
	rootlist.push(leaflist);

	testdata.get('folders').get(0).get(1).push(rootlist);
}
