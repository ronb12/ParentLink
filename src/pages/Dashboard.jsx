import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { getAnnouncements, getEvents } from '../firebase/firestore';
import { 
  MessageSquare, 
  BarChart3, 
  Megaphone, 
  Calendar, 
  FileText, 
  Users,
  TrendingUp,
  Clock,
  Bell
} from 'lucide-react';
import { format } from 'date-fns';

const Dashboard = () => {
  const { userData, isParent, isTeacher } = useAuth();
  const [announcements, setAnnouncements] = useState([]);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribeAnnouncements = getAnnouncements((snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setAnnouncements(data.slice(0, 3)); // Show only latest 3
    });

    const unsubscribeEvents = getEvents((snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setEvents(data.slice(0, 5)); // Show only next 5 events
    });

    setLoading(false);

    return () => {
      unsubscribeAnnouncements();
      unsubscribeEvents();
    };
  }, []);

  const quickActions = [
    {
      name: 'Send Message',
      description: 'Communicate with teachers/parents',
      icon: MessageSquare,
      href: '/messages',
      color: 'bg-blue-500'
    },
    {
      name: 'View Progress',
      description: 'Check student progress reports',
      icon: BarChart3,
      href: '/progress',
      color: 'bg-green-500'
    },
    {
      name: 'Announcements',
      description: 'Read latest announcements',
      icon: Megaphone,
      href: '/announcements',
      color: 'bg-yellow-500'
    },
    {
      name: 'Calendar',
      description: 'View upcoming events',
      icon: Calendar,
      href: '/calendar',
      color: 'bg-purple-500'
    },
    {
      name: 'Files',
      description: 'Access shared documents',
      icon: FileText,
      href: '/files',
      color: 'bg-indigo-500'
    },
    ...(isTeacher ? [{
      name: 'Students',
      description: 'Manage student information',
      icon: Users,
      href: '/students',
      color: 'bg-pink-500'
    }] : [])
  ];

  const stats = [
    {
      name: 'Unread Messages',
      value: '3',
      icon: MessageSquare,
      color: 'text-blue-600'
    },
    {
      name: 'Progress Reports',
      value: '12',
      icon: TrendingUp,
      color: 'text-green-600'
    },
    {
      name: 'Upcoming Events',
      value: events.length.toString(),
      icon: Calendar,
      color: 'text-purple-600'
    },
    {
      name: 'New Announcements',
      value: announcements.length.toString(),
      icon: Bell,
      color: 'text-yellow-600'
    }
  ];

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-800 rounded-lg p-6 text-white">
        <h1 className="text-3xl font-bold">
          Welcome back, {userData?.name}!
        </h1>
        <p className="text-primary-100 mt-2">
          {isParent 
            ? "Stay connected with your child's education journey"
            : "Manage your classroom and communicate with parents"
          }
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.name} className="card">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Icon className={`h-8 w-8 ${stat.color}`} />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">{stat.name}</p>
                  <p className="text-2xl font-semibold text-gray-900">{stat.value}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Quick Actions */}
        <div className="card">
          <div className="card-header">
            <h2 className="text-xl font-semibold text-gray-900">Quick Actions</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {quickActions.map((action) => {
              const Icon = action.icon;
              return (
                <a
                  key={action.name}
                  href={action.href}
                  className="p-4 border border-gray-200 rounded-lg hover:border-primary-300 hover:shadow-md transition-all duration-200"
                >
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-lg ${action.color}`}>
                      <Icon className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">{action.name}</h3>
                      <p className="text-sm text-gray-500">{action.description}</p>
                    </div>
                  </div>
                </a>
              );
            })}
          </div>
        </div>

        {/* Recent Announcements */}
        <div className="card">
          <div className="card-header">
            <h2 className="text-xl font-semibold text-gray-900">Recent Announcements</h2>
          </div>
          <div className="space-y-4">
            {announcements.length > 0 ? (
              announcements.map((announcement) => (
                <div key={announcement.id} className="border-l-4 border-primary-500 pl-4">
                  <h3 className="font-medium text-gray-900">{announcement.title}</h3>
                  <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                    {announcement.content}
                  </p>
                  <p className="text-xs text-gray-500 mt-2">
                    {announcement.createdAt && format(announcement.createdAt.toDate(), 'MMM d, yyyy')}
                  </p>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center py-4">No announcements yet</p>
            )}
          </div>
        </div>
      </div>

      {/* Upcoming Events */}
      <div className="card">
        <div className="card-header">
          <h2 className="text-xl font-semibold text-gray-900">Upcoming Events</h2>
        </div>
        <div className="space-y-4">
          {events.length > 0 ? (
            events.map((event) => (
              <div key={event.id} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                    <Calendar className="h-6 w-6 text-primary-600" />
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="font-medium text-gray-900">{event.title}</h3>
                  <p className="text-sm text-gray-600">{event.description}</p>
                  <div className="flex items-center mt-1 text-xs text-gray-500">
                    <Clock className="h-3 w-3 mr-1" />
                    {event.date && format(event.date.toDate(), 'MMM d, yyyy - h:mm a')}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-500 text-center py-4">No upcoming events</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
