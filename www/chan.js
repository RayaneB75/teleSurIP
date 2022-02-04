
/* Javascript file for key presses, channel timings, osd etc. */

/* stuff used for EPG

/*EPG flag */
var EPG_on = false;

/* Teletext on */
var Teletext_on = false;

/* last epg channel */
var last_epg_channel = 0;

/* how many channels are in the EPG list */
var active_channel_count = 0;

/* map of list index to channel number */
var index_channel_map = new Array();

var epg_inner_offset = 0;

var scroll_wrapper_height = 250;



/*EPG functions */
		function toggleEPG()
                {
                	//alert('toggleEPG');

                        if(EPG_on)
                        {
                        	//turn off epg div
                                document.getElementById('epg_panel').style.display = 'none';

                                //set EPG_on false
                                EPG_on = false;

                        }
                        else
                        {
                                //turn on epg div
                                document.getElementById('epg_panel').style.display = '';

                                //set EPG_on false
                                EPG_on = true;
                        }

                }

                function epg_channel_up()
                {
                	//alert('epg channel up');

                        if(last_epg_channel > 0)
                        {
                        	//change last epg selection background to grey
                                var old_index = 'selection_' + last_epg_channel;

                                document.getElementById(old_index).style.backgroundColor = 'grey';

                                //decrement last epg channel
                                last_epg_channel--;

                                //change new epg selection to aqua
                                var new_index = 'selection_' + last_epg_channel;
                                document.getElementById(new_index).style.backgroundColor = 'aqua';

                                // now do scroll check for list if selection off screen
                                scrollCheck();
                        }

                }

                function epg_channel_down()
                {
                	//alert('epg channel down');
                        if(last_epg_channel < (active_channel_count-1))
                        {
                        	//change last epg selection background to grey
                                var old_index = 'selection_' + last_epg_channel;

                                document.getElementById(old_index).style.backgroundColor = 'grey';

                                //decrement last epg channel
                                last_epg_channel++;

                                //change new epg selection to aqua
                                var new_index = 'selection_' + last_epg_channel;
                                document.getElementById(new_index).style.backgroundColor = 'aqua';

                                // now do scroll check for list if selection off screen

                                scrollCheck();
                        }

                }

                function play_epg_selected()
                {
                	//alert('epg play selected');
                        // derive channel number from either array or hidden input?
                        var channel_number = index_channel_map[last_epg_channel];

                        if(use_ASTB)
                        {
                        	play(channel_number);
                        }
                        else
                        {
                        	alert ('play channel selected: ' + channel_number);
                        }

                }

                function scrollCheck()
                {
                        var loop_again = false;
                	//check position of current selected relative to top and bottom of scroll_wrapper and move appropriately
                        var current_selection_index = 'selection_' + last_epg_channel;
                        var current_selection = document.getElementById(current_selection_index);

                        //get top left position of current selection
                        var selection_top = current_selection.offsetTop;

                        // get bottom left position of current selection
                        var selection_bottom = current_selection.offsetHeight + selection_top;



                        //check inner offset (epg_inner)
                        // dont need this, use global epg_inner_offset


                        //check scroll wrapper height (scroll_wrapper)

                        if(((selection_top + epg_inner_offset) < 10) && (epg_inner_offset < 0))
                        {
                        	//increase offset i.e. move inner down
                                epg_inner_offset++;

                                loop_again = true;
                        }
                        else if((selection_bottom + epg_inner_offset) > (scroll_wrapper_height - 10))
                        {
                                //decrease offset i.e. move inner up
                                epg_inner_offset--;

                                loop_again = true;
                        }



                        //update epg_inner_offset
                        var epg_inner_handle = document.getElementById('epg_inner');
                        epg_inner_handle.style.top = epg_inner_offset;

                        //alert('top: ' + selection_top + ', bottom: ' + selection_bottom + '\n epg_inner_offset: ' + epg_inner_offset + ', scroll_wrapper_height: ' + scroll_wrapper_height);

                        if(loop_again)
                        {
                        	//set up a timeout and go through this again

                                setTimeout("scrollCheck()",10);
                        }

                        return true;
                }

function toggleTeletext()
                {
                	//alert('toggleTeletext');

                        if(Teletext_on)
                        {
                        	//turn off Teletext
                                Browser.Action(46,0);

                                //set Teletext_on false
                                Teletext_on = false;

                        }
                        else
                        {
                                //turn on Teletext
                                Browser.Action(46,1);

                                //set Teletext_on false
                                Teletext_on = true;
                        }

                }


document.addEventListener('keypress', keypress, false);
document.addEventListener('keyup', keyup, false);
document.addEventListener('keydown', keydown, false);
window.addEventListener('keypress', keypress2, false);
window.addEventListener('keyup', keyup2, false);
window.addEventListener('keydown', keydown2, false);

function keypress(ev) {
    ASTB.DebugString("*** user.js: in keypress handler");
}

function keyup(ev) {
    ASTB.DebugString("*** user.js: in keyup handler");
}

function keydown(ev) {
    ASTB.DebugString("*** user.js: in keydown handler");
}

function keypress2(ev) {
    ASTB.DebugString("*** user.js: in window keypress handler");
}

function keyup2(ev) {
    ASTB.DebugString("*** user.js: in window keyup handler");
}

function keydown2(ev) {
    ASTB.DebugString("*** user.js: in window keydown handler");
}

/* List of keys as constants */


/* Keyboard */

/* Remote control */
var REMOTE_CHANNEL_UP               = 8492
var REMOTE_CHANNEL_DOWN             = 8494
var REMOTE_TELETEXT_RED             = 8512
var REMOTE_TELETEXT_GREEN           = 8513
var REMOTE_TELETEXT_YELLOW          = 8514
var REMOTE_TELETEXT_BLUE            = 8515
var REMOTE_TELETEXT_BUTON	            = 8577
var REMOTE_TELETEXT_BUTOFF	            = 8572
var OK_BUTTON								= 13	

/* used for EPG */
var REMOTE_GUIDE		    = 8537
var Left_arrow_key		= 37
var Up_arrow_key			= 38
var Right_arrow_key		= 39
var Down_arrow_key		= 40
var Small_arrow_up		= 8525
var Small_arrow_down		= 8490

/* Channel list is an array of:-
        channel number, URI to use, description (optional), uses existing chnls.txt file on stb to store channel info
*/     

var channel_list = new Array();
var initted = false;
var current_uri = "";
var current_info = "";
var current_pos = "";
var osd_chan = "";
var channelPopupTimeout = 0;
var menuTimeout = 0;    /* Timeout before hiding the menu popup */
var hidecount = 0;
var subtitleInfoObj = "";   /* Object containing info about stream's subtitles */
var menuSelected = -1;  /* Used for position in array for selected */
var menuMax = -1;       /* Max number of items */
var audioInfoObj = "";


/* Private functions */
function timer_loop()
{
    if (channelPopupTimeout > 0)
    {
        channelPopupTimeout--;
        if (channelPopupTimeout == 0)
        {
            // Execute what's on the popup channel
            setTimeout("play(" + osd_chan + ")", 100); 
        }
    }
    if (hidecount > 0)
    {
        hidecount--;
        if (hidecount == 0)
        {
            // Hide the popup
            hideinfo();
        }
    }
    if (menuTimeout > 0)
    {
        menuTimeout--;
        if (menuTimeout == 0)
        {
            // Hide the menu and clear objects */
            document.getElementById("channel_menu").style.visibility = "hidden";
            subtitleInfoObj = "";
            audioInfoObj = "";
            Browser.Lower();
        }
    }
    // Call back in a x milliseconds, this acts as the channel selection/change time.
      setTimeout("timer_loop()", 2000);
        
}


function get_details(channum)
{
    pos = -1;
    arraypos = 0;

    while ( (arraypos < channel_list.length) && (pos == -1) )
    {
        if (channel_list[arraypos] == channum)
        {
            current_pos = arraypos / 3;
            current_uri = channel_list[arraypos+1];
            current_info = channel_list[arraypos+2];
            pos = arraypos;
        }
        else
        {
            arraypos += 3;
        }
    }
    return pos;
}

function get_info(channum)
{
    info = "";
    arraypos = 0;

    while ( (arraypos < channel_list.length) && (info == "") )
    {
        if (channel_list[arraypos] == channum)
        {
            info = channel_list[arraypos+2];
        }
        else
        {
            arraypos += 3;
        }
    }
    return uri;
}

function channel_up()
{
    current_pos++; // Increment one up from the last given array pos
    if (current_pos >= (channel_list.length / 3) )
    {
        // Wrap round
        current_pos = 0;
    }
    play(channel_list[current_pos*3]);
}

function channel_down()
{
    current_pos--; // Decrement one up from the last given array pos
    if (current_pos < 0 )
    {
        // Wrap round
        current_pos = (channel_list.length / 3) - 1;
    }
    play(channel_list[current_pos*3]);
}

function numeric_key(key)
{
    try {

	        if (channelPopupTimeout == 0)
		        {
		            /* Start of entry */
		            osd_chan = 0;
		        }

		        osd_chan *= 10;
		        osd_chan = osd_chan + parseInt(key);
		        var popup_str = "<html><body><p class='channel_popup'>";
		        popup_str += osd_chan;
		        popup_str += "<\/p><\/body><\/html>";
		        document.getElementById("channel_popup").innerHTML = popup_str;
		        document.getElementById("channel_popup").style.visibility = "visible";
		
		        if (osd_chan < 100)
			     {
			         //ASTB.DebugString("Wait");        
			         channelPopupTimeout = 2;
			     }
			     else
				  {
			        //ASTB.DebugString("Go");
			        //channelPopupTimeout = 0;
			        play(osd_chan);
				  }
		    }
    catch (e) 
          {
//		        alert("numeric key: " + e);
			 }
}

/* Handlers to determine behavior on various key presses */

function keyHandler(e)
{
 var rtn = true;
    var pressedKey = e.which;

    if (document.all)    { e = window.event; }
    if (document.layers) { pressedKey = e.which; }
    if (document.all)    { pressedKey = e.keyCode; }

 if (pressedKey == 0)
	 {
	     /* Control code seen. Probable keyboard arrow key */
	     pressedKey = e.keyCode;
	 }

ASTB.DebugString("Keyboard - " + pressedKey);

    switch (pressedKey)
    {        
	     case REMOTE_GUIDE:
             toggleEPG();
             break;
	     case REMOTE_TELETEXT_BUTON:
             toggleTeletext();
	     break;
	     
        	case REMOTE_CHANNEL_UP:
             // AH if EPG displayed, epg_channel_up
             if(EPG_on)
             {
             	epg_channel_up();
             }
             else
             {
                channel_up();
             }
             break;

        case REMOTE_CHANNEL_DOWN:
             // AH if EPG displayed, epg_channel_down
             if(EPG_on)
             {
             	epg_channel_down();
             }
             else
             {
            	channel_down();
             }
             break;
        case Small_arrow_up:
             epg_channel_up();
             break;
        case Small_arrow_down:
             epg_channel_down();
             break;
      case 27:
	          ASTB.DebugString("esc");
	    	    rtn = false;
		  	    break;

        case 38:
             ASTB.DebugString("Up arrow pressed");
    		    epg_channel_up();
             break;
        case 40:
             ASTB.DebugString("Down arrow pressed");
           	 epg_channel_down();
             break;
        case 48:
        case 49:
        case 50:
        case 51:
        case 52:
        case 53:
        case 54:
        case 55:
        case 56:
        case 57:
             // Number key
             Browser.Raise();
             ASTB.DebugString("Key");
	     if(!Teletext_on) {
             	numeric_key(pressedKey-48);
	     }
             break;
    	case OK_BUTTON:
             // AH if EPG displayed, play_epg_selected
             if(EPG_on)
             {
             	play_epg_selected();
             }
             else
             {
            	ASTB.DebugString("Okay");
            	ASTB.DebugString(osd_chan);
            	channelPopupTimeout = 0;
            	play(osd_chan);
             }
             break;
       
    }
return rtn;

}

function hideinfo()
{
    document.getElementById("channel_popup").style.visibility = "hidden";
    document.getElementById("channel_info").style.visibility = "hidden";
    osd_chan = 0;
    Browser.Lower();
}

function onevent()
{
    switch (AVMedia.Event)
    {
        case 23:
            // PMT change - playing
            ASTB.DebugString("Now switched. Hide in 2 seconds");
            str = AVMedia.GetProgramInfo(AVMedia.PROGRAM_INFO_AUDIO | AVMedia.PROGRAM_INFO_SUBTITLE);
            hidecount = 2;
            //setTimeout("hideinfo()", 2000);
            break;
    }
}

function chan_init()
{
    if (initted == false)
    {
        try 
        {
            // Setup background colour to what the background colour in CSS
            // is set to.			
            //backgroundColour = document.body.style.backgroundColor;

            // Just set Chromakey and reset background colour to that value
// For older STB            
//ASTB.DefaultKeys(0);
//ASTB.WithChannels(0);
           
            ASTB.SetMouseState(false);
            Browser.SetToolbarState(false);
            //VideoDisplay.SetChromaKey(0x102030);
            //document.body.style.backgroundColor = "#102030";
            AVMedia.onEvent = "onevent()";
          
            // Setup keyhandling here
            document.onkeypress = keyHandler;
        } 
        catch (e) 
        {
            alert("Error is " + e);
            // Possible error if using PC
        }

        setTimeout("timer_loop()", 1000);
        initted = true;
    }
}

function play(channum)
{
    if (initted == false)
    {
        chan_init();
    }

    if (-1 != get_details(channum) )
    {
        //AVMedia.Play("src=" + current_uri + ";eomfreeze=yes");
        
        AVMedia.Play("src=" + current_uri );
        Browser.Raise();
        var popup_str = "<html><body><p class='channel_popup'>";
        popup_str += channum;
        popup_str += "<\/p><\/body><\/html>";
        document.getElementById("channel_popup").innerHTML = popup_str;
        document.getElementById("channel_popup").style.visibility = "visible";

        if (current_info != "")
        {
            var info_str = "<html><body><p class='channel_info'>"
            info_str += current_info;
            info_str +=  "<\/p><\/body><\/html>";
            document.getElementById("channel_info").innerHTML = info_str;
            document.getElementById("channel_info").style.visibility = "visible";
        }
        else
        {
            // If using channel up/down and the next channel doesn't have
            // description, then hide the info box
            document.getElementById("channel_info").style.visibility = "hidden"
        }

        document.getElementById("channel_menu").style.visibility = "hidden";
        hidecount = 5;
        subtitleInfoObj == "";
        // Store in a cookie this channel
        document.cookie = "lastchan=" + channum;
        osd_chan = 0;
    }        
    else
    {
        /* get here by having an invalid channel. Lower the
         * channel number popup */
        osd_chan = 0;
        setTimeout( "hideinfo()", 1000 );
    }
}

/* Public functions */
function add(channum, uri, description)
{
    channel_list.push(channum, uri, description);
}

function addChannelList(min, max)
{
    if ( (min == undefined) && (max == undefined) )
    {
        // Process through the whole list
        min = 0;
        max = 999;
    }

    if ( (typeof min == "number") && (typeof max == "number") )
    {
        for (loop=min; loop<=max; loop++)
        {
            uri = ASTB.GetChannel(loop);

            if ( (uri != undefined) && (uri != "") )
            {
                ASTB.DebugString("Adding " + loop + " uri = " + uri);
                add(loop, uri, "");
            }
        }
    }
    else if ( (typeof min == "object") && (max == undefined) )
    {
        // Array of specific channels
        for (loop=0; loop< min.length; loop++)
        {
            uri = ASTB.GetChannel(loop);
            if ( (uri != undefined) && (uri != "") )
            {
                ASTB.DebugString("Adding " + loop + " uri = " + uri);
                add(loop, uri, "");
            }
        }
    }
}

function start(initial)
 {
    /* Look for value from cookies and use that if found.
       If not then use the value passed in as starting value */

    if (document.cookie.indexOf("lastchan=") != -1)
    {
       ASTB.DebugString("Cookie may have been set");
       ASTB.DebugString("cookie is " + document.cookie + "   length is " + document.cookie.length);
       var prevchan = document.cookie.substring(9, document.cookie.length);
       ASTB.DebugString("prevchan is " + prevchan);
		 uri=ASTB.GetChannel(prevchan);
	 }
	 
	
if ( (uri == undefined) || (uri == "") )
            {
                play(initial)
            }
else
{
	play(prevchan);
}
//		alert("playing last selected channel");
//        play(prevchan);
//           }
//    else
//    {
//       ASTB.DebugString("No cookie. So use default");
//       play(initial);
//    }        
//  }
//--!>


}