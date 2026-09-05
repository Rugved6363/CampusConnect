import { useState, useEffect } from 'react'
import { useAuth } from '../../context/AuthContext'
import { collegeApi } from '../../api/collegeApi'
import { festivalsApi } from '../../api/festivalsApi'
import { formatPrice } from '../../utils/formatters'
import toast from 'react-hot-toast'
import './CollegeDashboard.css'

// ─── helpers ───────────────────────────────────────────
const EMPTY_EVENT = { title:'',description:'',category:'CULTURAL',totalSeats:'',price:'0',startTime:'',endTime:'',venue:'',posterUrl:'' }
const EMPTY_FEST  = { name:'',description:'',edition:'',startDate:'',endDate:'',venue:'',posterUrl:'',websiteUrl:'',mainPassPrice:'0',mainPassSeats:'500' }
const EMPTY_CAT   = { name:'',description:'',icon:'🎪' }

function fmt(dt) {
  if (!dt) return '—'
  return new Date(dt).toLocaleString('en-IN',{dateStyle:'medium',timeStyle:'short'})
}

// ─── CollegeDashboard ───────────────────────────────────
export default function CollegeDashboard() {
  const { user } = useAuth()
  const [tab, setTab] = useState('events')

  return (
    <div className="page college-page fade-in">
      <div className="container">
        <div className="college-header">
          <div>
            <h1 className="college-title">🏛️ {user?.name}</h1>
            <p className="college-sub">Manage your events and festivals</p>
          </div>
        </div>

        <div className="cd-tabs">
          <button className={`cd-tab ${tab==='events'?'active':''}`} onClick={()=>setTab('events')}>
            🎪 Events
          </button>
          <button className={`cd-tab ${tab==='festivals'?'active':''}`} onClick={()=>setTab('festivals')}>
            🎡 Festivals
          </button>
        </div>

        {tab === 'events'    && <EventsTab />}
        {tab === 'festivals' && <FestivalsTab />}
      </div>
    </div>
  )
}

// ══════════════════════════════════════════════════════════
//  EVENTS TAB — single-day bookable events
// ══════════════════════════════════════════════════════════
function EventsTab() {
  const [events, setEvents]     = useState([])
  const [loading, setLoading]   = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editId, setEditId]     = useState(null)
  const [form, setForm]         = useState(EMPTY_EVENT)
  const [saving, setSaving]     = useState(false)

  useEffect(()=>{ load() },[])

  async function load() {
    setLoading(true)
    try { const r = await collegeApi.getMyEvents(); setEvents(r.data) }
    catch { toast.error('Failed to load events') }
    finally { setLoading(false) }
  }

  function openCreate() { setForm(EMPTY_EVENT); setEditId(null); setShowForm(true) }
  function openEdit(e)  {
    setForm({
      title:e.title, description:e.description||'', category:e.category,
      totalSeats:e.totalSeats, price:e.price||'0',
      startTime:(e.startTime||e.dateTime||'').slice(0,16),
      endTime:(e.endTime||'').slice(0,16),
      venue:e.venue||'', posterUrl:e.posterUrl||''
    })
    setEditId(e.id); setShowForm(true)
  }

  async function handleSubmit(ev) {
    ev.preventDefault()
    if (!form.title||!form.totalSeats||!form.startTime){toast.error('Title, seats & start time required');return}
    setSaving(true)
    try {
      const p={ ...form, totalSeats:Number(form.totalSeats), price:Number(form.price)||0,
                startTime:form.startTime+':00', endTime:form.endTime?form.endTime+':00':null }
      if (editId) { await collegeApi.updateEvent(editId,p); toast.success('Updated ✅') }
      else        { await collegeApi.createEvent(p);        toast.success('Event published 🚀') }
      setShowForm(false); load()
    } catch(err){ toast.error(err.response?.data?.message||'Failed') }
    finally { setSaving(false) }
  }

  async function del(id,title) {
    if(!confirm(`Delete "${title}"?`)) return
    try { await collegeApi.deleteEvent(id); toast.success('Deleted'); load() }
    catch { toast.error('Failed') }
  }

  return (
    <div className="tab-content">
      <div className="tab-header">
        <h2 className="section-heading">My Events ({events.length})</h2>
        <button className="btn btn-primary" onClick={openCreate}>+ Create Event</button>
      </div>

      {showForm && (
        <EventForm
          form={form} setForm={setForm} saving={saving}
          title={editId?'✏️ Edit Event':'➕ Create Event'}
          onSubmit={handleSubmit} onCancel={()=>setShowForm(false)}
        />
      )}

      {loading ? <Spinner/> : events.length===0 ? (
        <div className="empty-events">
          <p>🎪 No events yet.</p>
          <button className="btn btn-primary" onClick={openCreate}>+ Create First Event</button>
        </div>
      ) : (
        <div className="college-events-list">
          {events.map(e=>(
            <EventRow key={e.id} event={e} onEdit={()=>openEdit(e)} onDelete={()=>del(e.id,e.title)}/>
          ))}
        </div>
      )}
    </div>
  )
}

// ══════════════════════════════════════════════════════════
//  FESTIVALS TAB — multi-day festivals with categories & sub-events
// ══════════════════════════════════════════════════════════
function FestivalsTab() {
  const [festivals, setFestivals] = useState([])
  const [loading, setLoading]     = useState(true)
  const [showFestForm, setShowFestForm] = useState(false)
  const [festForm, setFestForm]   = useState(EMPTY_FEST)
  const [saving, setSaving]       = useState(false)
  const [expandedId, setExpandedId] = useState(null)

  // category & sub-event forms per festival
  const [catForm, setCatForm]     = useState({})       // festivalId → { name,icon,desc }
  const [showCatForm, setShowCatForm] = useState({})   // festivalId → bool
  const [subForm, setSubForm]     = useState({})       // catId → {...}
  const [showSubForm, setShowSubForm] = useState({})   // catId → bool

  useEffect(()=>{ load() },[])

  async function load() {
    setLoading(true)
    try { const r = await festivalsApi.getMyFestivals(); setFestivals(r.data) }
    catch { toast.error('Failed to load festivals') }
    finally { setLoading(false) }
  }

  async function createFestival(ev) {
    ev.preventDefault()
    if (!festForm.name||!festForm.startDate||!festForm.endDate){toast.error('Name & dates required');return}
    if (festForm.endDate <= festForm.startDate){toast.error('End must be after start');return}
    setSaving(true)
    try {
      await festivalsApi.createFestival({
        ...festForm,
        startDate: festForm.startDate+':00',
        endDate:   festForm.endDate+':00',
        mainPassPrice: Number(festForm.mainPassPrice)||0,
        mainPassSeats: Number(festForm.mainPassSeats)||500,
      })
      toast.success('Festival created! 🎡')
      setShowFestForm(false); setFestForm(EMPTY_FEST); load()
    } catch(err){ toast.error(err.response?.data?.message||'Failed') }
    finally { setSaving(false) }
  }

  async function deleteFestival(id,name) {
    if(!confirm(`Delete festival "${name}" and all its sub-events?`)) return
    try { await festivalsApi.deleteFestival(id); toast.success('Festival deleted'); load() }
    catch { toast.error('Failed') }
  }

  async function addCategory(festivalId) {
    const f = catForm[festivalId]
    if (!f?.name){toast.error('Category name required');return}
    try {
      await festivalsApi.addCategory(festivalId, { name:f.name, description:f.description||'', icon:f.icon||'🎪' })
      toast.success('Category added ✅')
      setShowCatForm(p=>({...p,[festivalId]:false}))
      setCatForm(p=>({...p,[festivalId]:EMPTY_CAT}))
      load()
    } catch { toast.error('Failed') }
  }

  async function deleteCategory(festivalId,catId,name) {
    if(!confirm(`Delete category "${name}" and all its sub-events?`)) return
    try { await festivalsApi.deleteCategory(festivalId,catId); toast.success('Deleted'); load() }
    catch { toast.error('Failed') }
  }

  async function addSubEvent(festivalId,catId) {
    const f = subForm[catId]
    if (!f?.title||!f?.totalSeats||!f?.startTime){toast.error('Title, seats & start time required');return}
    try {
      await festivalsApi.addSubEvent(festivalId, catId, {
        ...f,
        category: f.category||'CULTURAL',
        totalSeats: Number(f.totalSeats),
        price: Number(f.price)||0,
        startTime: f.startTime+':00',
        endTime: f.endTime ? f.endTime+':00' : null,
      })
      toast.success('Sub-event added 🎟️')
      setShowSubForm(p=>({...p,[catId]:false}))
      setSubForm(p=>({...p,[catId]:EMPTY_EVENT}))
      load()
    } catch { toast.error('Failed') }
  }

  return (
    <div className="tab-content">
      <div className="tab-header">
        <h2 className="section-heading">My Festivals ({festivals.length})</h2>
        <button className="btn btn-primary" onClick={()=>setShowFestForm(!showFestForm)}>
          {showFestForm ? '✕ Cancel' : '+ Create Festival'}
        </button>
      </div>

      {/* Festival creation form */}
      {showFestForm && (
        <div className="college-form-card fade-in">
          <div className="form-card-header">
            <h3 className="form-card-title">🎡 Create New Festival</h3>
            <button className="close-btn" onClick={()=>setShowFestForm(false)}>✕</button>
          </div>
          <form onSubmit={createFestival} className="college-form">
            <div className="cf-row-2">
              <div className="form-group">
                <label>Festival Name *</label>
                <input className="form-input" placeholder="e.g. Euphoria 2025"
                  value={festForm.name} onChange={e=>setFestForm(f=>({...f,name:e.target.value}))}/>
              </div>
              <div className="form-group">
                <label>Edition</label>
                <input className="form-input" placeholder="e.g. 5th Edition"
                  value={festForm.edition} onChange={e=>setFestForm(f=>({...f,edition:e.target.value}))}/>
              </div>
            </div>
            <div className="form-group">
              <label>Description</label>
              <textarea className="form-input form-textarea" rows={2}
                value={festForm.description} onChange={e=>setFestForm(f=>({...f,description:e.target.value}))}/>
            </div>
            <div className="cf-row-2">
              <div className="form-group">
                <label>Start Date & Time *</label>
                <input type="datetime-local" className="form-input"
                  value={festForm.startDate} onChange={e=>setFestForm(f=>({...f,startDate:e.target.value}))}/>
              </div>
              <div className="form-group">
                <label>End Date & Time *</label>
                <input type="datetime-local" className="form-input"
                  value={festForm.endDate} onChange={e=>setFestForm(f=>({...f,endDate:e.target.value}))}/>
              </div>
            </div>
            <div className="cf-row-3">
              <div className="form-group">
                <label>Venue</label>
                <input className="form-input" placeholder="College Campus"
                  value={festForm.venue} onChange={e=>setFestForm(f=>({...f,venue:e.target.value}))}/>
              </div>
              <div className="form-group">
                <label>Main Pass Seats</label>
                <input type="number" className="form-input" min={1}
                  value={festForm.mainPassSeats} onChange={e=>setFestForm(f=>({...f,mainPassSeats:e.target.value}))}/>
              </div>
              <div className="form-group">
                <label>Main Pass Price ₹</label>
                <input type="number" className="form-input" min={0}
                  value={festForm.mainPassPrice} onChange={e=>setFestForm(f=>({...f,mainPassPrice:e.target.value}))}/>
              </div>
            </div>
            <div className="cf-row-2">
              <div className="form-group">
                <label>Poster URL</label>
                <input className="form-input" placeholder="https://…"
                  value={festForm.posterUrl} onChange={e=>setFestForm(f=>({...f,posterUrl:e.target.value}))}/>
              </div>
              <div className="form-group">
                <label>Website URL</label>
                <input className="form-input" placeholder="https://…"
                  value={festForm.websiteUrl} onChange={e=>setFestForm(f=>({...f,websiteUrl:e.target.value}))}/>
              </div>
            </div>
            <div className="form-actions">
              <button type="button" className="btn btn-outline" onClick={()=>setShowFestForm(false)}>Cancel</button>
              <button type="submit" className="btn btn-primary" disabled={saving}>
                {saving?'Creating…':'🎡 Create Festival'}
              </button>
            </div>
          </form>
        </div>
      )}

      {loading ? <Spinner/> : festivals.length===0 ? (
        <div className="empty-events">
          <p>🎡 No festivals yet.</p>
          <p>Create a festival to add multiple event categories and sub-events.</p>
          <button className="btn btn-primary" onClick={()=>setShowFestForm(true)}>+ Create First Festival</button>
        </div>
      ) : (
        <div className="festival-list">
          {festivals.map(fest=>(
            <div key={fest.id} className="festival-row">

              {/* Festival header */}
              <div className="fest-header-row">
                <div className="fest-poster-wrap">
                  <img src={fest.posterUrl||'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=120'}
                    alt={fest.name} className="fest-poster"
                    onError={e=>{e.target.src='https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=120'}}/>
                </div>
                <div className="fest-info">
                  <div className="fest-name">{fest.name}</div>
                  {fest.edition && <span className="fest-edition">{fest.edition}</span>}
                  <div className="fest-dates">📅 {fmt(fest.startDate)} → {fmt(fest.endDate)}</div>
                  <div className="fest-venue">📍 {fest.venue||'TBA'}</div>
                  <div className="fest-cats">{fest.categories?.length||0} categories · {
                    fest.categories?.reduce((s,c)=>s+(c.subEvents?.length||0),0)||0
                  } sub-events</div>
                </div>
                <div className="fest-actions">
                  <button className="btn btn-outline cer-btn"
                    onClick={()=>setExpandedId(expandedId===fest.id?null:fest.id)}>
                    {expandedId===fest.id?'▲ Collapse':'▼ Manage'}
                  </button>
                  <button className="btn-danger-sm" onClick={()=>deleteFestival(fest.id,fest.name)}>Delete</button>
                </div>
              </div>

              {/* Expanded: categories & sub-events */}
              {expandedId===fest.id && (
                <div className="fest-body">

                  {/* Add category */}
                  <div className="fest-section-header">
                    <span className="fest-section-title">📂 Event Categories</span>
                    <button className="btn btn-outline cer-btn"
                      onClick={()=>setShowCatForm(p=>({...p,[fest.id]:!p[fest.id]}))}>
                      {showCatForm[fest.id]?'Cancel':'+ Add Category'}
                    </button>
                  </div>

                  {showCatForm[fest.id] && (
                    <div className="inline-form">
                      <input className="form-input" placeholder="Category name (e.g. Dance Events)"
                        value={catForm[fest.id]?.name||''}
                        onChange={e=>setCatForm(p=>({...p,[fest.id]:{...p[fest.id],name:e.target.value}}))}/>
                      <input className="form-input" placeholder="Icon emoji e.g. 💃"
                        style={{width:80}}
                        value={catForm[fest.id]?.icon||'🎪'}
                        onChange={e=>setCatForm(p=>({...p,[fest.id]:{...p[fest.id],icon:e.target.value}}))}/>
                      <input className="form-input" placeholder="Description (optional)"
                        value={catForm[fest.id]?.description||''}
                        onChange={e=>setCatForm(p=>({...p,[fest.id]:{...p[fest.id],description:e.target.value}}))}/>
                      <button className="btn btn-primary" onClick={()=>addCategory(fest.id)}>✅ Add</button>
                    </div>
                  )}

                  {/* Categories */}
                  {(!fest.categories||fest.categories.length===0) ? (
                    <p className="sub-empty">No categories yet. Add one above to organise your sub-events.</p>
                  ) : fest.categories.map(cat=>(
                    <div key={cat.id} className="cat-block">
                      <div className="cat-header">
                        <span className="cat-icon">{cat.icon}</span>
                        <span className="cat-name">{cat.name}</span>
                        <span className="cat-count">{cat.subEvents?.length||0} sub-events</span>
                        <div style={{marginLeft:'auto',display:'flex',gap:6}}>
                          <button className="btn btn-outline cer-btn"
                            onClick={()=>setShowSubForm(p=>({...p,[cat.id]:!p[cat.id]}))}>
                            {showSubForm[cat.id]?'Cancel':'+ Sub-Event'}
                          </button>
                          <button className="btn-danger-sm"
                            onClick={()=>deleteCategory(fest.id,cat.id,cat.name)}>Delete</button>
                        </div>
                      </div>

                      {/* Add sub-event form */}
                      {showSubForm[cat.id] && (
                        <div className="subevent-form">
                          <div className="cf-row-2">
                            <div className="form-group">
                              <label>Sub-Event Title *</label>
                              <input className="form-input" placeholder="e.g. Solo Dance"
                                value={subForm[cat.id]?.title||''}
                                onChange={e=>setSubForm(p=>({...p,[cat.id]:{...p[cat.id],title:e.target.value}}))}/>
                            </div>
                            <div className="form-group">
                              <label>Category</label>
                              <select className="form-input"
                                value={subForm[cat.id]?.category||'CULTURAL'}
                                onChange={e=>setSubForm(p=>({...p,[cat.id]:{...p[cat.id],category:e.target.value}}))}>
                                <option value="CULTURAL">🎭 Cultural</option>
                                <option value="TECHNICAL">💻 Technical</option>
                                <option value="SPORTS">⚽ Sports</option>
                                <option value="WORKSHOP">🧠 Workshop</option>
                              </select>
                            </div>
                          </div>
                          <div className="form-group">
                            <label>Description</label>
                            <input className="form-input" placeholder="Short description"
                              value={subForm[cat.id]?.description||''}
                              onChange={e=>setSubForm(p=>({...p,[cat.id]:{...p[cat.id],description:e.target.value}}))}/>
                          </div>
                          <div className="cf-row-3">
                            <div className="form-group">
                              <label>Start Time *</label>
                              <input type="datetime-local" className="form-input"
                                value={subForm[cat.id]?.startTime||''}
                                onChange={e=>setSubForm(p=>({...p,[cat.id]:{...p[cat.id],startTime:e.target.value}}))}/>
                            </div>
                            <div className="form-group">
                              <label>End Time</label>
                              <input type="datetime-local" className="form-input"
                                value={subForm[cat.id]?.endTime||''}
                                onChange={e=>setSubForm(p=>({...p,[cat.id]:{...p[cat.id],endTime:e.target.value}}))}/>
                            </div>
                            <div className="form-group">
                              <label>Seats *</label>
                              <input type="number" className="form-input" min={1}
                                value={subForm[cat.id]?.totalSeats||''}
                                onChange={e=>setSubForm(p=>({...p,[cat.id]:{...p[cat.id],totalSeats:e.target.value}}))}/>
                            </div>
                          </div>
                          <div className="cf-row-3">
                            <div className="form-group">
                              <label>Price ₹</label>
                              <input type="number" className="form-input" min={0}
                                value={subForm[cat.id]?.price||'0'}
                                onChange={e=>setSubForm(p=>({...p,[cat.id]:{...p[cat.id],price:e.target.value}}))}/>
                            </div>
                            <div className="form-group">
                              <label>Venue</label>
                              <input className="form-input" placeholder="Stage A"
                                value={subForm[cat.id]?.venue||''}
                                onChange={e=>setSubForm(p=>({...p,[cat.id]:{...p[cat.id],venue:e.target.value}}))}/>
                            </div>
                            <div className="form-group" style={{justifyContent:'flex-end',paddingTop:22}}>
                              <button className="btn btn-primary"
                                onClick={()=>addSubEvent(fest.id,cat.id)}>
                                🎟️ Add Sub-Event
                              </button>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Sub-events list */}
                      {cat.subEvents?.length>0 && (
                        <div className="sub-events-list">
                          {cat.subEvents.map(sub=>(
                            <div key={sub.id} className="sub-event-row">
                              <div className="sub-info">
                                <span className="sub-title">{sub.title}</span>
                                <span className="sub-meta">📅 {fmt(sub.startTime||sub.dateTime)}</span>
                                <span className="sub-meta">🪑 {sub.availableSeats}/{sub.totalSeats}</span>
                                <span className="sub-price">{formatPrice(sub.price)}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// ── Shared components ────────────────────────────────────
function EventForm({ form, setForm, saving, title, onSubmit, onCancel, notice }) {
  const s = (k,v) => setForm(f=>({...f,[k]:v}))
  return (
    <div className="college-form-card fade-in">
      <div className="form-card-header">
        <h2 className="form-card-title">{title}</h2>
        <button className="close-btn" onClick={onCancel}>✕</button>
      </div>
      {notice && <div className="subevent-notice">{notice}</div>}
      <form onSubmit={onSubmit} className="college-form">
        <div className="cf-row-2">
          <div className="form-group">
            <label>Event Title *</label>
            <input className="form-input" value={form.title} onChange={e=>s('title',e.target.value)}/>
          </div>
          <div className="form-group">
            <label>Category *</label>
            <select className="form-input" value={form.category} onChange={e=>s('category',e.target.value)}>
              <option value="CULTURAL">🎭 Cultural</option>
              <option value="TECHNICAL">💻 Technical</option>
              <option value="SPORTS">⚽ Sports</option>
              <option value="WORKSHOP">🧠 Workshop</option>
            </select>
          </div>
        </div>
        <div className="form-group">
          <label>Description</label>
          <textarea className="form-input form-textarea" rows={2} value={form.description} onChange={e=>s('description',e.target.value)}/>
        </div>
        <div className="cf-row-2">
          <div className="form-group">
            <label>Start Date & Time *</label>
            <input type="datetime-local" className="form-input" value={form.startTime} onChange={e=>s('startTime',e.target.value)}/>
          </div>
          <div className="form-group">
            <label>End Date & Time</label>
            <input type="datetime-local" className="form-input" value={form.endTime} onChange={e=>s('endTime',e.target.value)}/>
          </div>
        </div>
        <div className="cf-row-3">
          <div className="form-group">
            <label>Total Seats *</label>
            <input type="number" className="form-input" min={1} value={form.totalSeats} onChange={e=>s('totalSeats',e.target.value)}/>
          </div>
          <div className="form-group">
            <label>Price ₹</label>
            <input type="number" className="form-input" min={0} value={form.price} onChange={e=>s('price',e.target.value)}/>
          </div>
          <div className="form-group">
            <label>Venue</label>
            <input className="form-input" value={form.venue} onChange={e=>s('venue',e.target.value)}/>
          </div>
        </div>
        <div className="form-group">
          <label>Poster URL</label>
          <input className="form-input" placeholder="https://…" value={form.posterUrl} onChange={e=>s('posterUrl',e.target.value)}/>
        </div>
        <div className="form-actions">
          <button type="button" className="btn btn-outline" onClick={onCancel}>Cancel</button>
          <button type="submit" className="btn btn-primary" disabled={saving}>
            {saving?'Saving…':'🚀 Publish'}
          </button>
        </div>
      </form>
    </div>
  )
}

function EventRow({ event, onEdit, onDelete }) {
  return (
    <div className="cer-main" style={{border:'1px solid var(--border)',borderRadius:12,marginBottom:0}}>
      <div className="cer-poster-wrap">
        <img src={event.posterUrl||'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=200'}
          alt={event.title} className="cer-poster"
          onError={e=>{e.target.src='https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=200'}}/>
      </div>
      <div className="cer-info">
        <div className="cer-top">
          <span className="cer-cat">{event.category}</span>
          <h3 className="cer-title">{event.title}</h3>
        </div>
        <div className="cer-meta">
          <span>📅 {fmt(event.startTime||event.dateTime)}</span>
          {event.endTime && <span>→ {fmt(event.endTime)}</span>}
          <span>📍 {event.venue||'TBA'}</span>
        </div>
        <div className="cer-bottom">
          <span className="cer-seats">🪑 {event.availableSeats}/{event.totalSeats}</span>
          <span className={`cer-price ${!event.price||event.price===0?'free':''}`}>
            {formatPrice(event.price)}
          </span>
        </div>
      </div>
      <div className="cer-actions">
        <button className="btn btn-outline cer-btn" onClick={onEdit}>Edit</button>
        <button className="btn-danger-sm" onClick={onDelete}>Delete</button>
      </div>
    </div>
  )
}

function Spinner() {
  return <div style={{textAlign:'center',padding:'60px 0'}}><div className="spinner" style={{width:40,height:40,margin:'0 auto'}}/></div>
}
