#!/usr/bin/perl -w

use Data::Dumper;
use JSON; # imports encode_json, decode_json, to_json and from_json.





my ($x,$y);
my @arr;
$x = $y = 0;
my $mut;
while (<>){
    if ($_ =~ /^Sub/){
	@origs = split(/\s+/, $_);
	@origs = splice (@origs, 1);
#	print Dumper @origs;exit;
	next;
    }


    @tmp = split(/\s+/, $_);



    foreach $t(@tmp){
	my %obj;

	if ($t =~ /^[acdefghiklmnpqrstvwy]/i){
	    $mut = $t;
	    next;
	}else{
	    $obj{'score'} = $t;
	}
	$obj{'mut'} = $mut;
	$obj{'row'} = $y;
	$obj{'col'} = $x;
	
	$obj{'label'} = $origs[$x];
	push( @arr, \%obj );
#	warn $x;
	$x++;
    }

    $y++;
    $x=0;

}#while

$arr = \@arr;
$json_text = to_json($arr);
print $json_text;
#print Dumper @arr;

1;
