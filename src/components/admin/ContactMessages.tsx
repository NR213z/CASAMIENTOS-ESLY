import { useState, useEffect } from 'react';
import { supabase, ContactMessage } from '@/lib/supabase';
import { Mail, MailOpen, Trash2, Phone, Calendar, User, MessageSquare, Search } from 'lucide-react';

const ContactMessages = () => {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);
  const [filter, setFilter] = useState<'all' | 'unread' | 'read'>('all');
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('contact_messages')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error && data) {
      setMessages(data);
    }
    setLoading(false);
  };

  const toggleRead = async (message: ContactMessage) => {
    const { error } = await supabase
      .from('contact_messages')
      .update({ read: !message.read })
      .eq('id', message.id);

    if (!error) {
      setMessages((prev) =>
        prev.map((m) => (m.id === message.id ? { ...m, read: !m.read } : m))
      );
      if (selectedMessage?.id === message.id) {
        setSelectedMessage({ ...message, read: !message.read });
      }
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('¿Estás seguro de que deseas eliminar este mensaje?')) {
      return;
    }

    const { error } = await supabase
      .from('contact_messages')
      .delete()
      .eq('id', id);

    if (!error) {
      setMessages((prev) => prev.filter((m) => m.id !== id));
      if (selectedMessage?.id === id) {
        setSelectedMessage(null);
      }
    }
  };

  const handleSelectMessage = async (message: ContactMessage) => {
    setSelectedMessage(message);
    // Auto-mark as read when opening an unread message
    if (!message.read) {
      await toggleRead(message);
    }
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleString('es-AR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const filteredMessages = messages
    .filter((m) => {
      if (filter === 'unread') return !m.read;
      if (filter === 'read') return m.read;
      return true;
    })
    .filter((m) => {
      if (!search) return true;
      const q = search.toLowerCase();
      return (
        m.name.toLowerCase().includes(q) ||
        m.email.toLowerCase().includes(q) ||
        m.message.toLowerCase().includes(q)
      );
    });

  const unreadCount = messages.filter((m) => !m.read).length;

  if (loading) {
    return (
      <div className="text-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gold mx-auto mb-4"></div>
        <p className="text-warm-gray font-body">Cargando mensajes...</p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
        <div>
          <h2 className="font-display text-2xl md:text-3xl font-light text-foreground">
            Mensajes de Contacto
          </h2>
          <p className="text-sm text-warm-gray font-body mt-1">
            {messages.length} mensajes totales
            {unreadCount > 0 && (
              <span className="ml-2 text-gold">({unreadCount} sin leer)</span>
            )}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-warm-gray"
            />
            <input
              type="text"
              placeholder="Buscar..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 pr-4 py-2 border border-warm-gray/30 bg-background text-foreground font-body text-sm focus:outline-none focus:border-gold transition-colors"
            />
          </div>
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value as any)}
            className="px-4 py-2 border border-warm-gray/30 bg-background text-foreground font-body text-sm focus:outline-none focus:border-gold transition-colors"
          >
            <option value="all">Todos</option>
            <option value="unread">Sin leer</option>
            <option value="read">Leídos</option>
          </select>
        </div>
      </div>

      {messages.length === 0 ? (
        <div className="text-center py-20 bg-background border border-gold/20 p-12">
          <MessageSquare size={48} className="mx-auto mb-4 text-warm-gray/40" />
          <p className="text-warm-gray font-body text-lg mb-2">
            Aún no hay mensajes
          </p>
          <p className="text-warm-gray/70 font-body text-sm">
            Cuando alguien envíe un mensaje desde el formulario de contacto, aparecerá aquí.
          </p>
        </div>
      ) : (
        <div className="grid md:grid-cols-[1fr_2fr] gap-6">
          {/* Messages list */}
          <div className="bg-background border border-warm-gray/20 max-h-[70vh] overflow-y-auto">
            {filteredMessages.length === 0 ? (
              <div className="p-8 text-center">
                <p className="text-warm-gray font-body text-sm">
                  No hay mensajes que coincidan con los filtros.
                </p>
              </div>
            ) : (
              filteredMessages.map((message) => (
                <button
                  key={message.id}
                  onClick={() => handleSelectMessage(message)}
                  className={`w-full text-left border-b border-warm-gray/10 p-4 hover:bg-sand/50 transition-colors ${
                    selectedMessage?.id === message.id ? 'bg-sand' : ''
                  } ${!message.read ? 'border-l-4 border-l-gold' : ''}`}
                >
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2 min-w-0">
                      {message.read ? (
                        <MailOpen size={14} className="text-warm-gray shrink-0" />
                      ) : (
                        <Mail size={14} className="text-gold shrink-0" />
                      )}
                      <p
                        className={`font-body text-sm truncate ${
                          !message.read ? 'font-semibold text-foreground' : 'text-foreground/80'
                        }`}
                      >
                        {message.name}
                      </p>
                    </div>
                    <p className="text-xs text-warm-gray shrink-0 font-body">
                      {new Date(message.created_at).toLocaleDateString('es-AR', {
                        day: '2-digit',
                        month: '2-digit',
                      })}
                    </p>
                  </div>
                  <p className="text-xs text-warm-gray font-body mb-1 truncate">
                    {message.email}
                  </p>
                  <p className="text-xs text-foreground/60 font-body line-clamp-2">
                    {message.message}
                  </p>
                </button>
              ))
            )}
          </div>

          {/* Message detail */}
          <div className="bg-background border border-warm-gray/20 p-6 md:p-8">
            {selectedMessage ? (
              <div>
                <div className="flex items-start justify-between mb-6 pb-6 border-b border-warm-gray/20">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <User size={18} className="text-gold" />
                      <h3 className="font-display text-xl font-light text-foreground">
                        {selectedMessage.name}
                      </h3>
                    </div>
                    <div className="space-y-1 text-sm font-body">
                      <div className="flex items-center gap-2 text-warm-gray">
                        <Mail size={14} />
                        <a
                          href={`mailto:${selectedMessage.email}`}
                          className="hover:text-gold transition-colors"
                        >
                          {selectedMessage.email}
                        </a>
                      </div>
                      {selectedMessage.phone && (
                        <div className="flex items-center gap-2 text-warm-gray">
                          <Phone size={14} />
                          <a
                            href={`https://wa.me/${selectedMessage.phone.replace(/\D/g, '')}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:text-gold transition-colors"
                          >
                            {selectedMessage.phone}
                          </a>
                        </div>
                      )}
                      <div className="flex items-center gap-2 text-warm-gray">
                        <Calendar size={14} />
                        <span>{formatDate(selectedMessage.created_at)}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => toggleRead(selectedMessage)}
                      className="flex items-center gap-2 border border-warm-gray/30 text-foreground px-3 py-2 text-xs uppercase tracking-[0.2em] font-body hover:border-gold hover:text-gold transition-colors"
                      title={selectedMessage.read ? 'Marcar como no leído' : 'Marcar como leído'}
                    >
                      {selectedMessage.read ? <Mail size={14} /> : <MailOpen size={14} />}
                    </button>
                    <button
                      onClick={() => handleDelete(selectedMessage.id)}
                      className="flex items-center gap-2 border border-red-200 text-red-600 px-3 py-2 text-xs uppercase tracking-[0.2em] font-body hover:bg-red-50 transition-colors"
                      title="Eliminar"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>

                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-warm-gray font-body mb-3">
                    Mensaje
                  </p>
                  <p className="font-body text-foreground leading-relaxed whitespace-pre-wrap">
                    {selectedMessage.message}
                  </p>
                </div>

                <div className="mt-8 pt-6 border-t border-warm-gray/20 flex gap-3">
                  <a
                    href={`mailto:${selectedMessage.email}?subject=Re: Consulta desde el sitio web`}
                    className="flex-1 flex items-center justify-center gap-2 bg-charcoal text-primary-foreground px-6 py-3 text-xs uppercase tracking-[0.2em] font-body hover:bg-charcoal/90 transition-colors"
                  >
                    <Mail size={14} />
                    Responder por Email
                  </a>
                  {selectedMessage.phone && (
                    <a
                      href={`https://wa.me/${selectedMessage.phone.replace(/\D/g, '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 flex items-center justify-center gap-2 border border-warm-gray/30 text-foreground px-6 py-3 text-xs uppercase tracking-[0.2em] font-body hover:border-gold hover:text-gold transition-colors"
                    >
                      <Phone size={14} />
                      WhatsApp
                    </a>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full min-h-[400px] text-center">
                <MessageSquare size={48} className="text-warm-gray/40 mb-4" />
                <p className="text-warm-gray font-body">
                  Selecciona un mensaje para ver los detalles
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ContactMessages;
