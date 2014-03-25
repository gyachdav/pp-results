var PAGE = function(argument) {


    var activeDivs = [],
        inactiveDivs = [],
        cached = {},
        quotes = [],
        pageComponents = {
            Dashboard: [{
                    FeatureViewer: {
                        showAlignment: true
                    }
                },
                'SummaryTable',
                'SequenceViewer',
                'AlignmentTable',
                'AlignmentPDBTable',
                'AAConsistency',
                'SSConsistency',
                'Quotes',
                'DisuqsViewer'
            ],
            SecondaryStructure: [{
                    FeatureViewer: {
                        providers: ["REPROFSec", "PROFsec", "PROFAcc", "PROFtmb"],
                        showAlignment: false
                    }
                }, {
                    'SSConsistency': '',

                }, 'SolvAcc',
                'Quotes',
            ],
            Transmembrane: [{
                'FeatureViewer': {
                    providers: ["PHDhtm"],
                    showAlignment: false
                }
            }, 'Quotes', ],
            Disorder: [{
                'FeatureViewer': {
                    providers: ["PROFbval", "Ucon", "NORSnet", "MD"],
                    showAlignment: false
                }
            }, 'Quotes'],
            Binding: [{
                'FeatureViewer': {
                    providers: ["ISIS", "DISIS"],
                    showAlignment: false
                }
            }, 'Quotes', ],
            Disulphide: [{
                'FeatureViewer': {
                    providers: ["DISULFIND"],
                    showAlignment: false
                }
            }, 'Quotes', ],
            Heatmap: [
                'HeatmapViewer'
            ],
            SubcellLoc: [
                "SubcellLocViewer",
                'Quotes'
            ],
            GOAnnot: [
                "GOAnnotViewer",
                'Quotes'
            ],
            Litsearch: [
                "LitsearchViewer"
            ]
        },
        defaultPage = "Dashboard",
        currentPage,
        mainContainerDiv = jQuery("#content"),
        loadingDiv = jQuery(".load-div"),
        dataObj,
        providers,
        showAlignment;

    var navBar = {
        Dashboard: {
            targetDiv: ".navbar",
            items: [{
                    'Export': [{
                        name: 'allExport',
                        text: "Download All Data Files",
                        func: "exportALL"
                    }, {
                        name: 'xmlExport',
                        text: "Download in XML format",
                        func: "exportXML"
                    }, {
                        name: 'jsonExport',
                        text: "Download in JSON format",
                        func: "exportJSON"
                    }]
                }
                // ,
                // {
                // 	'Email': 'nothing'
                // },
                //  {
                // 	'?': 'popOver'
                // }

            ]
        },
        SecondaryStructure: {
            targetDiv: ".navbar",
            items: [{
                    'Export': [{
                        name: 'secstructExport',
                        text: "Download Raw Data File",
                        func: "exportMethod",
                        params: ["profRdb"]
                    }, {
                        name: 'jsonExport',
                        text: "Download in JSON format",
                        func: "exportJSON",
                        params: ['PROFsec']
                    }]
                }
                // , {
                // 	'Email': 'nothing'
                // }
            ]
        },
        Transmembrane: {
            targetDiv: ".navbar",
            items: [{
                    'Export': [{
                        name: 'htmExport',
                        text: "Download Raw Data File",
                        func: "exportMethod",
                        params: ["reprof"]
                    }, {
                        name: 'jsonExport',
                        text: "Download in JSON format",
                        func: "exportJSON",
                        params: ['PHDhtm']
                    }]
                }

                // , {
                // 	'Email': 'nothing'
                // }
            ]
        },

        Disorder: {
            targetDiv: ".navbar",
            items: [{
                    'Export': [{
                        name: 'disorderExport',
                        text: "Download Raw Data File",
                        func: "exportMethod",
                        params: ["mdisorder"]
                    }, {
                        name: 'jsonExport',
                        text: "Download PROFbval prediction in JSON format",
                        func: "exportJSON",
                        params: ['PROFbval']
                    }, {
                        name: 'jsonExport',
                        text: "Download UCON prediction in JSON format",
                        func: "exportJSON",
                        params: ['UCON']
                    }, {
                        name: 'jsonExport',
                        text: "Download NORSnet prediction in JSON format",
                        func: "exportJSON",
                        params: ['NORSnet']
                    }, {
                        name: 'jsonExport',
                        text: "Download MetaDisorder prediction in JSON format",
                        func: "exportJSON",
                        params: ['MD']
                    }]
                }
                // , {
                // 	'Email': 'nothing'
                // }
            ]
        },
        Disulphide: {
            targetDiv: ".navbar",
            items: [{
                    'Export': [{
                        name: 'htmExport',
                        text: "Download Raw Data File",
                        func: "exportMethod",
                        params: ["disulfinder"]
                    }, {
                        name: 'jsonExport',
                        text: "Download DISULFIND prediction in JSON format",
                        func: "exportJSON",
                        params: ['DISULFIND']
                    }]
                }
                // , {
                // 	'Email': 'nothing'
                // }
            ]
        },
        Binding: {
            targetDiv: ".navbar",
            items: [{
                    'Export': [{
                        name: 'isisExport',
                        text: "Download Raw Data File",
                        func: "exportMethod",
                        params: ["isis"]
                    }, {
                        name: 'jsonExport',
                        text: "Download ISIS prediction in JSON format",
                        func: "exportJSON",
                        params: ['ISIS']
                    }]
                }
                // , {
                // 	'Email': 'nothing'
                // }
            ]
        },
        SubcellLoc: {
            targetDiv: ".navbar",
            items: [{
                    'Export': [{
                        name: 'subcellExport',
                        text: "Download Raw Data File",
                        func: "exportMethod",
                        params: ["lc3"]
                    }, {
                        name: 'jsonExport',
                        text: "Download LocTree3 prediction in JSON format",
                        func: "exportJSON",
                        params: ['LocTree3']
                    }]
                }
                // , {
                // 	'Email': 'nothing'
                // }
            ]
        },
        GOAnnot: {
            targetDiv: ".navbar",
            items: [{
                    'Export': [{
                        name: 'goannotExport',
                        text: "Download Raw Data File",
                        func: "exportMethod",
                        params: ["metastudent"]
                    }, {
                        name: 'jsonExport',
                        text: "Download Metastudent prediction in JSON format",
                        func: "exportJSON",
                        params: ['Metastudent']
                    }]
                }
                // , {
                // 	'Email': 'nothing'
                // }
            ]
        },
        Heatmap: {
            targetDiv: ".navbar",
            items: [{
                    'Export': [{
                        name: 'heatmapExport',
                        text: "Download Raw Data File",
                        func: "exportMethod",
                        params: ["snap"]
                    }]
                }
                // , {
                // 	'Email': 'nothing'
                // }
            ]
        }
    };

    (argument.page) ? currentPage = argument.page : currentPage = defaultPage;
    (argument.providers) ? providers = argument.providers : providers = [];
    (argument.showAlignment) ? showAlignment = argument.showAlignment : showAlignment = false;

    if (!dataObj) dataObj = argument.data;

    var isCached = function(elementName) {
        if (cached[elementName]) return true;
        return false;
    };

    var cacheFetch = function(elementName) {
        return (cached[elementName]);
    };

    var cacheStore = function(elementName, element) {
        cached[elementName] = element;
    };


    var cacheRemove = function(elementName) {
        delete(cached[elementName]);
    };

    var visualComponents = {
        drawLitsearchViewer: function(argument) {
            function toHtmlViewSingleResult(x) {
                return jQuery('<li>').html(jQuery('<a title="Link to PubMed">').attr('href', x.link).attr('id', 'pubmed-' + x.id).html(
                    '<div class="item-title">' + x.title + '</div><div class="item-rest">' + x.pubdate + ', ' + x.source + '</div>'));
            }

            function toHtmlView(summariesResults) {
                var ret = jQuery('<ul>');
                for (var i = 0; i < summariesResults.length; i++) {
                    ret.append(toHtmlViewSingleResult(summariesResults[i]));
                }
                return ret;
            }


            var tmpProtName = dataObj.getProteinName();
            if (tmpProtName.match(/\w+_\w+/))
                tmpProtName = tmpProtName.split('_')[0];
            var term = tmpProtName + '+OR+' + dataObj.getProteinID();

            var numPages = 23;
            var pageHtml;
            var $cached_pages = jQuery('#cached-pages');

            function genAndCachePage(term, num) {
                var $previous = $cached_pages.find('ul').not('.invisible');
                $previous.addClass('disappearing');

                dataObj.searchLitsearchData(
                    term,
                    num - 1, //The interface is 1-indexed; the search is 0-indexed

                    function(result) {
                        $cached_pages.find('.alert').hide(0);

                        dataObj.setLitsearchData(result.summaries);
                        numPages = result.numPages;
                        pageHtml = toHtmlView(dataObj.getLitsearchData());
                        pageHtml.attr('id', 'page-' + num);

                        $previous.addClass('invisible').hide(0);
                        $cached_pages.append(pageHtml);
                    },
                    function() {
                        $cached_pages.find('.alert').show(0);
                    }
                );

            }

            //Show first page
            genAndCachePage(term, 1);
            jQuery('#page-selection').bootpag({
                total: Math.min(numPages, 23),
                page: 1,
                maxVisible: 10,
                //href: "#page-{{number}}",
                leaps: false
            }).on("page", function(event, num) {
                pageHtml = $cached_pages.find('#page-' + num);

                if (!pageHtml.length) {
                    genAndCachePage(term, num);
                } else {
                    $cached_pages.find('.alert').hide(0);
                    $cached_pages.find('ul').css('display', 'none').addClass('invisible');
                    pageHtml.removeClass('disappearing invisible').show(0);
                }
            });
        },
        drawSequenceViewer: function(argument) {
            sv = new SEQUENCE_VIEWER({
                targetDiv: argument.targetDiv,
                sequence: dataObj.getSequence()
            });
        },
        drawAlignmentTable: function(argument) {
            targetDiv = argument.targetDiv;
            ALI_VIEW.draw(dataObj.getAlignmentLocations(), jQuery("#" + targetDiv));
        },

        drawAlignmentPDBTable: function(argument) {
            targetDiv = argument.targetDiv;
            arrAlignments = dataObj.getAlignmentLocations("pdb");
            if (arrAlignments.length > 0) ALI_VIEW.draw(arrAlignments, jQuery("#" + targetDiv));
        },

        drawAAConsistency: function(argument) {
            targetDiv = argument.targetDiv;
            jQuery("#" + targetDiv).append("<h3>Amino Acid composition</h3>");
            PIE_CHART.toPieData(dataObj.getAAComposition()).drawPieChart(targetDiv);
        },
        drawHeatmapViewer: function(argument) {
            var dataToFetch = '/~roos//get/snap/json/?md5=' + dataObj.getMD5Seq();

            var jqxhr = jQuery.getJSON(dataToFetch,
                function(arr) {
                    jQuery("#heatmap").empty();
                });
            jqxhr.done(function(data) {

                var painter = new Biojs.HeatmapViewer({
                    jsonData: data,
                    user_defined_config: {
                        colorLow: 'green',
                        colorMed: 'white',
                        colorHigh: 'red'
                    },
                    target: 'heatmap'
                });

            });

            jqxhr.error(function(xhr, textStatus, errorThrown) {
                var msg = "Results currently unavailable";
                jQuery("#heatmap").empty().text(msg);
                console.log('request failed');
            });
        },
        drawFeatureViewer: function(argument) {
            // TODO this will have to be re-factored so the reference object is retrieve via the getReferenceByProvider in the ppres.data class
            if (argument.showAlignment)
                quotes.push(dataObj.getReference(dataObj.getJsonData().entry.aliProviderGroup.ref));

            if (!argument.providers) argument.providers = APP.providers;

            i = argument.providers.length;
            while (i--)
                quotes.push(dataObj.getReferenceByProvider(argument.providers[i]));

            var fv = new FEATURE_VIEWER({
                targetDiv: argument.targetDiv,
                dataObj: dataObj,
                providers: argument.providers,
                showAlignment: argument.showAlignment
            });
            fv.setup();
            fv.draw();
        },
        drawSSConsistency: function(argument) {
            targetDiv = argument.targetDiv;
            jQuery("#" + targetDiv).append("<h3>Secondary Structure Composition</h3>");
            PIE_CHART.toPieData(dataObj.getSSComposition()).drawPieChart(targetDiv);
        },

        drawSolvAcc: function(argument) {
            targetDiv = argument.targetDiv;
            jQuery("#" + targetDiv).append("<h3>Solvent Accessibility</h3>");
            PIE_CHART.toPieData(dataObj.getSolvAccComposition()).drawPieChart(targetDiv);
        },

        drawQuotes: function(argument) {

            var pleaseCite = 'If you find any of the above annotations useful in your research please cite the relevant method:';

            targetDiv = argument.targetDiv;

            i = quotes.length;
            var refList = jQuery('<div>').addClass('alert alert-info').append(jQuery('<p/>').text(pleaseCite).addClass('text-error'));
            while (i--) {
                if (quotes[i]) {
                    refList.append(
                        jQuery('<ul/>')

                        .append(jQuery('<li/>')
                            .append(jQuery('<strong/>').text(' "' + quotes[i].citation.title + '" '))
                            .append(jQuery('<span>').text(jQuery.map(quotes[i].citation.authorList.person, function(n, i) {
                                return n.name;
                            }).join(', ')))

                            .append(jQuery('<span/>').text(' ' + quotes[i].citation.name +
                                ' ' + quotes[i].citation.volume + ': ' +
                                quotes[i].citation.first + '-' + quotes[i].citation.last + ' ' + '(' + quotes[i].citation.date + ')'))));
                }
            }



            var accordionContainer = jQuery('<div/>').addClass('accordion').attr('id', 'referencesInfo');
            var accordionGroup = jQuery('<div/>').addClass('accordion-group');
            var accordionHeader = jQuery('<div/>').addClass('accordion-heading')
                .append(jQuery('<a/>').addClass('accordion-toggle').attr('data-toggle', 'collapse').attr('data-parent', '#referencesInfo').attr('href', '#referencesInfoList')
                    .append(jQuery('<span/>').text('References (Click to Expand)')));
            var accordionInner = jQuery('<div>').attr('id', 'referencesInfoList').addClass('accordion-body collapse')
                .append(jQuery('<div>').addClass('accordion-inner')
                    .append(refList));
            accordionContainer.append(accordionGroup.append(accordionHeader)).append(accordionInner);
            jQuery("#" + targetDiv).append(accordionContainer);

        },


        drawSummaryTable: function(argument) {
            targetDiv = argument.targetDiv;

            jQuery("#" + targetDiv).append("<h3>Summary</h3>");
            var table = jQuery("<table/>");
            table.addClass("table table-striped");

            seqModal = new MODAL({
                modalName: 'SequenceViewer',
                modalTitle: "Query Sequence"
            });
            pdbModal = new MODAL({
                modalName: 'AlignmentPDBTable',
                modalTitle: "Aligned Structures"
            });
            aliModal = new MODAL({
                modalName: 'AlignmentTable',
                modalTitle: "Aligned Proteins"
            });
            table.append("<tr><td>Sequence Length</td><td><a href='#SequenceViewer' role='button' data-toggle='modal'>" + dataObj.getSequence().length + "</a></td></tr>");
            table.append("<tr><td>Number of Aligned Proteins</td><td><a href='#AlignmentTable' role='button' data-toggle='modal'>" + dataObj.getAlignmentsCount() + "</a></td></tr>");
            arrAlignments = dataObj.getAlignmentsByDatabase('pdb');
            if (arrAlignments > 0) table.append("<tr><td>Number of Matched PDB Structures</td><td><a href='#AlignmentPDBTable' role='button' data-toggle='modal'>" + arrAlignments + "<a/></td></tr>");

            if (dataObj.getOrganismName()) {
                table.append("<tr><td>Likely Organism</td><td> <a title='Link to the NCBI taxonomy database' href='http://www.ncbi.nlm.nih.gov/Taxonomy/Browser/wwwtax.cgi?id=" + dataObj.getOrganismTaxID() + "' target='_blank'>" + dataObj.getOrganismName() + "</a></td></tr>");

            }

            jQuery("#" + targetDiv).append(table);
            return (jQuery("#" + targetDiv)).html();
        },

        drawSubcellLocViewer: function(argument) {
            targetDiv = argument.targetDiv;
            quotes.push(dataObj.getReferenceByProvider('LocTree2'));


            var nav_div = jQuery("<div id='_subcell_nav' />");

            var content_div = jQuery("<div id='_subcell_cntnt'/>");
            content_div.addClass("tab-content");
            var list = jQuery('<ul/>');
            list.addClass("nav nav-pills nav-tabs");
            list.append('<li class="disabled"><a href="#">Domains:</a> </li>')

            // var domains = ["arch", "bact", "euka", "plant", "animal", "proka"];
            var domains = ["arch", "bact", "euka"];


            active_domain = 'euka';
            if ((dataObj.getOrganismDomain()) && (dataObj.getOrganismDomain() != 'unknown'))
                active_domain = domains = [dataObj.getOrganismDomain()];

            var seq_length_restrictions = ': prediction missing. Re-running this job will most likely generate subcellular localization prediction.';
            if (dataObj.getSequence().length > 2045)
                seq_length_restrictions = ': this service cannot provide predictions for sequences longer than 2045 residues.';
            if (dataObj.getSequence().length < 10)
                seq_length_restrictions = ': this service cannot provide predictions for sequences shorter than 10 residues.';

            for (var i in domains) {
                var _curr_div;
                var _curr_li = jQuery('<li><a data-toggle="tab" href="#' + domains[i] + '_localisation_container">' + SUBCELL_VIEW.getDomainFullName(domains[i]) + '</a></li>');
                var prediction = dataObj.getSubCellLocations(domains[i]);
                if (domains[i] == 'virus') _curr_div = jQuery("<div />").addClass('alert alert-error').text("Prediction unavailable for virus proteins");
                else if (!prediction) _curr_div = jQuery("<div />").addClass('alert alert-error').text("Data unavailable" + seq_length_restrictions);
                else _curr_div = SUBCELL_VIEW.localisationDiv(prediction);
                _curr_div.addClass("tab-pane");
                content_div.append(_curr_div);
                if (domains[i] == active_domain) {
                    _curr_li.addClass('active');
                    _curr_div.addClass('active');
                }
                list.append(_curr_li);

            }
            nav_div.append(list);

            jQuery("#" + targetDiv).append(nav_div);
            jQuery("#" + targetDiv).append(content_div);

            return (jQuery("#" + targetDiv)).html();
        },


        drawGOAnnotViewer: function(argument) {
            targetDiv = argument.targetDiv;

            quotes.push(dataObj.getReferenceByProvider('Metastudent'));

            GOANNOT_VIEW.renderGoAnnotHTML(dataObj, targetDiv);

            targetDivCopy = targetDiv


            jQuery("#_goannot_cntnt_img").hide();

            jQuery((jQuery('.tableHolder').get().reverse())).each(function() {
                var holder = jQuery(this);

                var isEmpty = jQuery("td", holder.children("table")).length == 0;

                if (!isEmpty) {
                    holder.children("table").tablesorter({
                        sortList: [
                            [3, 3]
                        ],
                        headers: {
                            0: {
                                sorter: false
                            },
                            1: {
                                sorter: false
                            },
                            5: {
                                sorter: false
                            }
                        }
                    });

                    jQuery(this).children("table").tablesorterPager({
                        container: holder.children(".pager"),
                        toggler: jQuery(".allToggler", holder)
                    });
                }
                var refreshorForm = jQuery(".refreshorForm", jQuery(".refreshor", holder));
                var onto = refreshorForm.attr("name");

                refreshorForm.submit(function() {
                    if (!isEmpty) {
                        GOANNOT_VIEW.renderImage(holder.children("table"), onto, targetDivCopy, jQuery('.tableHolder')[0] == holder[0]);
                    } else {
                        jQuery(("#" + onto + "_img_container")).text("n/a");
                    }
                    return false;
                });


                jQuery(("[name=goSel" + onto + "],") + ("[name=goSel" + onto + "All]")).each(function() {
                    jQuery(this).change(function() {
                        jQuery(("#showButton" + onto)).show();

                    });
                });

                jQuery(".refreshorForm", jQuery(".refreshor", holder)).submit();
            });

            jQuery("#_goannot_cntnt_img").show();
        },
        drawDisuqsViewer: function(argument) {
            // existance of recommended name indicates
            // that this is a swissprot protein
            var recName = dataObj.getRecommendedName();
            if (!recName || 0 === recName.length)
                return;
            if (!recName || /^\s*$/.test(recName))
                return;


            disqus_url = 'https://' + dataObj.getMD5Seq();
            disqus_title = dataObj.getProteinName();
            jQuery("#disqus_div").show().removeClass('hidden');

            (function() {
                var dsq = document.createElement('script');
                dsq.type = 'text/javascript';
                dsq.async = true;
                dsq.src = '//' + disqus_shortname + '.disqus.com/embed.js';
                (document.getElementsByTagName('head')[0] || document.getElementsByTagName('body')[0]).appendChild(dsq);
            })();

        }
    };


    var getComponent = function(component, config) {
        var element;

        if (!config) var config = {};
        jQuery.extend(config, {
            targetDiv: component + "Container"
        });

        if (!isCached(component)) {
            var fnName = "draw" + component;
            element = visualComponents[fnName].call(this, config);
            if (element) cacheStore(component, element);

        } else {
            element = cacheFetch(component);
        }

        return element;
    };

    function capitalize(s) {
        return s[0].toUpperCase() + s.slice(1);
    }

    return {
        getDefaultPage: function() {
            return defaultPage;
        },
        setDataObj: function(__dataObj) {
            dataObj = __dataObj;
        },
        setShowAlignment: function(flag) {
            showAlignmnet = flag;
        },
        getShowAlignment: function() {
            return showAlignment;
        },

        draw: function() {
            loadingDiv.show();
            mainContainerDiv.empty();
            jQuery(".modal").remove();
            var pagePath = APP.path + 'html/' + currentPage + ".html";
            var config = undefined;

            if (!isCached(currentPage)) {
                jQuery.get(pagePath)
                    .done(function(pageHTML) {

                        mainContainerDiv.append(pageHTML);

                        var nc = new NAME_CHANGE({
                            targetDiv: jQuery('.job-name'),
                            dataObj: dataObj
                        });

                        if (navBar[currentPage])
                            var nb = new NAVBAR(navBar[currentPage]);


                        (function() {
                            var defline = jQuery('.defline');
                            // defline.
                            if (defline) {
                                var rec_name = '';
                                var t_match;
                                var dl = dataObj.getDefLine();
                                if (t_match = dl.match(/^(.+)OS\=.+$/)) {
                                    rec_name = t_match[1];
                                    if (rec_name) {
                                        rec_name_link = jQuery('<a>', {
                                            text: rec_name,
                                            title: 'Open ' + dataObj.getProteinID() + ' in UniProtKB',
                                            href: 'http://www.uniprot.org/uniprot/' + dataObj.getProteinID(),
                                            target: '_blank'
                                        });
                                        defline.text("Recommended Name: ").append(rec_name_link);
                                    }
                                }
                            }


                            var subcellDiv = jQuery('.subcelllocdiv');
                            if (subcellDiv) {
                                var domain = dataObj.getOrganismDomain();
                                var subcellLocation = dataObj.getSubCellLocations(domain);
                                if ((subcellLocation) && (subcellLocation[domain])) {

                                    var t_subcell_text = SUBCELL_VIEW.resolveName(subcellLocation[domain].localisation);
                                    subcell_link = jQuery('<a>', {
                                        text: t_subcell_text,
                                        title: 'See prediction details',
                                        href: '#',
                                        click: function() {
                                            APP.showPage('subcell');
                                            jQuery(".nav-list").children(".active").removeClass("active");
                                            jQuery(".nav-list").children("#subcell").addClass("active");
                                            return false;
                                        }
                                    });

                                    subcellDiv.text("Predicted Subcellular Localization: ").append(subcell_link);

                                }
                            }

                            if (dataObj.getIsExpired())
                                var job_run_div = JOB_RUN({
                                    reqid: dataObj.getJobID(),
                                    original_date: dataObj.getModificationDate(),
                                    target_div: 'job-run-div'
                                });



                            var formatDivContainer = jQuery('.formats');
                            var jobId = dataObj.getJobID();
                            var formatDiv = jQuery('<div/>');
                            jQuery(formatDiv).append(jQuery('<a/>').attr('href', 'html_results?req_id=' + jobId)
                                .attr('target', '_blank')
                                .attr('title', 'Complete data formatted for web presentation.')
                                .addClass('label label-info outer')
                                .text('HTML'));
                            jQuery(formatDiv).append(jQuery('<a/>').attr('href', 'text_results?req_id=' + jobId)
                                .attr('target', '_blank')
                                .attr('title', 'Complete data in the original flat text format.')
                                .addClass('label label-warning outer')
                                .text('TEXT'));

                            formatDivContainer.append(formatDiv);

                        }());

                        cacheStore(currentPage, pageHTML);
                        jQuery.each(pageComponents[currentPage], function(i, component) {
                            if (typeof component === 'object') {
                                config = component[Object.keys(component)];
                                component = Object.keys(component)[0];
                            }
                            var element = getComponent(component, config);
                            if (element) jQuery("#" + component + "Container", mainContainerDiv).html(element);
                        });
                    });


            } else {
                var pageHTML = cacheFetch(currentPage)
                mainContainerDiv.append(pageHTML);

                jQuery.each(pageComponents[currentPage], function(i, component) {
                    var element = _getComponent(component);
                    if (element) jQuery("#" + component + "Container", mainContainerDiv).html(element);
                });
            }
            loadingDiv.hide();

        }
    }
};