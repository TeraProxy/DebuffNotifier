const HURRICANE = 60010,
	HURRICANE_COOLDOWN = 119,
	CONTAGION = 701700,
	CONTAGION_PVP = 701701

module.exports = function DebuffNotifier(dispatch) {
	let cid = null,
		player = '',
		partyMembers = null,
		hurricaneTime = HURRICANE_COOLDOWN,
		hurricaneTimer = null,
		enabled = false

	dispatch.hook('S_LOGIN', 1, event => {
		({cid} = event)
		player = event.name
		enabled = true
	})

	dispatch.hook('S_PARTY_MEMBER_LIST', 4, (event) => {
		partyMembers = event.members
	})	

	dispatch.hook('S_ABNORMALITY_BEGIN', 2, event => { 
		if(event.source.equals(cid) && (event.id == HURRICANE))
		{
			notify('<font color="#ffffff">You have applied </font><font color="#56b4e9">Hurricane</font><font color="#ffffff">!</font>')
			notifyChat('<font color="#ffffff">You have applied </font><font color="#56b4e9">Hurricane</font><font color="#ffffff">!</font>')
			
			hurricaneTimer = setInterval(() => {
			switch (hurricaneTime) {
				case 90:
				  notify('<font color="#d55e00">Hurricane</font><font color="#ffffff"> is ready in </font><font color="#d55e00">' + hurricaneTime + 's</font>')
				  notifyChat('<font color="#d55e00">Hurricane</font><font color="#ffffff"> is ready in </font><font color="#d55e00">' + hurricaneTime + 's</font>')
				  break
				case 60:
				  notify('<font color="#d55e00">Hurricane</font><font color="#ffffff"> is ready in </font><font color="#d55e00">' + hurricaneTime + 's</font>')
				  notifyChat('<font color="#d55e00">Hurricane</font><font color="#ffffff"> is ready in </font><font color="#d55e00">' + hurricaneTime + 's</font>')
				  break
				case 30:
				  notify('<font color="#d55e00">Hurricane</font><font color="#ffffff"> is ready in </font><font color="#d55e00">' + hurricaneTime + 's</font>')
				  notifyChat('<font color="#d55e00">Hurricane</font><font color="#ffffff"> is ready in </font><font color="#d55e00">' + hurricaneTime + 's</font>')
				  break
				case 15:
				  notify('<font color="#d55e00">Hurricane</font><font color="#ffffff"> is ready in </font><font color="#d55e00">' + hurricaneTime + 's</font>')
				  notifyChat('<font color="#d55e00">Hurricane</font><font color="#ffffff"> is ready in </font><font color="#d55e00">' + hurricaneTime + 's</font>')
				  break
				case 0:
				  notifyReady('<font color="#ffffff">Your </font><font color="#56b4e9">Hurricane</font><font color="#ffffff"> is </font><font color="#56b4e9">ready</font><font color="#ffffff">!</font>')
				  notifyChat('<font color="#ffffff">Your </font><font color="#56b4e9">Hurricane</font><font color="#ffffff"> is </font><font color="#56b4e9">ready</font><font color="#ffffff">!</font>')
				  clearInterval(hurricaneTimer)
				  hurricaneTime = HURRICANE_COOLDOWN
				  break
			  }
			  hurricaneTime -= 1
			}, 1000)
		}
		if ((event.id == CONTAGION) || (event.id == HURRICANE) || (event.id == CONTAGION_PVP))
		{	
			for (let member in partyMembers)
			{				
				if (event.source.equals(partyMembers[member].cID))
				{
					let memberName = partyMembers[member].name
					let duration = (event.duration / 1000)
					
					switch (event.id) 
					{
						case CONTAGION:
							notify('<font color="#ffffff">' + memberName + ' has applied <font color="#56b4e9">Contagion</font><font color="#ffffff"> for </font><font color="#56b4e9">' + duration + 's</font>')
							notifyChat('<font color="#ffffff">' + memberName + ' has applied <font color="#56b4e9">Contagion</font><font color="#ffffff"> for </font><font color="#56b4e9">' + duration + 's</font>')
							break
						case HURRICANE:
							notify('<font color="#ffffff">' + memberName + ' has applied <font color="#56b4e9">Hurricane</font><font color="#ffffff"> for </font><font color="#56b4e9">' + duration + 's</font>')
							notifyChat('<font color="#ffffff">' + memberName + ' has applied <font color="#56b4e9">Hurricane</font><font color="#ffffff"> for </font><font color="#56b4e9">' + duration + 's</font>')
							break
					}
				}
			}
		}
	})
	
	dispatch.hook('S_ABNORMALITY_REFRESH', 1, event => { 
		if ((event.id == CONTAGION) || (event.id == HURRICANE) || (event.id == CONTAGION_PVP))
		{	
			let duration = (event.duration / 1000)
			switch (event.id) 
			{
				case CONTAGION:
					notify('<font color="#56b4e9">Contagion</font><font color="#ffffff"> has been reapplied for </font><font color="#56b4e9">' + duration + 's</font>')
					notifyChat('<font color="#56b4e9">Contagion</font><font color="#ffffff"> has been reapplied for </font><font color="#56b4e9">' + duration + 's</font>')
					break
				case HURRICANE:
					notify('<font color="#56b4e9">Hurricane</font><font color="#ffffff"> has been reapplied for </font><font color="#56b4e9">' + duration + 's</font>')
					notifyChat('<font color="#56b4e9">Hurricane</font><font color="#ffffff"> has been reapplied for </font><font color="#56b4e9">' + duration + 's</font>')
					break
			}
		}
	})
	
	dispatch.hook('S_ABNORMALITY_END', 1, event => { 
		if ((event.id == CONTAGION) || (event.id == HURRICANE) || (event.id == CONTAGION_PVP))
		{	
			switch (event.id) 
			{
				case CONTAGION:
					notify('<font color="#d55e00">Contagion</font><font color="#ffffff"> has </font><font color="#d55e00">worn off</font>')
					notifyChat('<font color="#d55e00">Contagion</font><font color="#ffffff"> has </font><font color="#d55e00">worn off</font>')
					break
				case HURRICANE:
					notify('<font color="#d55e00">Hurricane</font><font color="#ffffff"> has </font><font color="#d55e00">worn off</font>')
					notifyChat('<font color="#d55e00">Hurricane</font><font color="#ffffff"> has </font><font color="#d55e00">worn off</font>')
					break
			}
		}
	})
	
	// ################# //
	// ### Chat Hook ### //
	// ################# //
	
	dispatch.hook('C_WHISPER', 1, (event) => {
		if(event.target.toUpperCase() === "!debuffnotifier".toUpperCase()) {
			if (/^<FONT>on?<\/FONT>$/i.test(event.message)) {
				enabled = true
				message('Debuff Notifier <font color="#009e73">enabled</font>.')
				console.log('Debuff Notifier enabled.')
			}
			else if (/^<FONT>off?<\/FONT>$/i.test(event.message)) {
				enabled = false
				message('Debuff Notifier <font color="#d55e00">disabled</font>.')
				console.log('Debuff Notifier disabled.')
			}
			else message('Commands: "on" (enable Debuff Notifier),'
								+ ' "off" (disable Debuff Notifier)'
						)
			return false
		}
	})
	
	function message(msg) {
		dispatch.toClient('S_WHISPER', 1, {
			player: cid,
			unk1: 0,
			gm: 0,
			unk2: 0,
			author: '!DebuffNotifier',
			recipient: player,
			message: msg
		})
	}
	
	function notifyChat(msg) {
		dispatch.toClient('S_CHAT', 1, {
			channel: 1, // Party
			authorID: 0,
			unk1: 0,
			gm: 0,
			unk2: 0,
			authorName: '',
			message: msg
		})
	}
	
	function notify(msg) {
		if (!enabled) return
		dispatch.toClient('S_DUNGEON_EVENT_MESSAGE', 1, {
            unk1: 31, // Normal Text
            unk2: 0,
            unk3: 27, // 27
            message: msg
        })
	}
	
	function notifyReady(msg) {
		if (!enabled) return
		dispatch.toClient('S_DUNGEON_EVENT_MESSAGE', 1, {
            unk1: 42, // Blue Shiny Text
            unk2: 0,
            unk3: 27, // 27
            message: msg
        })
	}
}
